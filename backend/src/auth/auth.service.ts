import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtPayload } from './jwt-payload.interface';
import { RefreshToken } from './refresh-token.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const user = await this.validateUser(loginUserDto.email, loginUserDto.password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const payload: JwtPayload = { email: user.email, sub: user.id };
      const accessToken = this.jwtService.sign(payload, { secret: process.env.JWT_SECRET, expiresIn: '15m' });
      const refreshToken = await this.generateRefreshToken(user);

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    } catch (error) {
      this.logger.error('Error during login', error.stack);
      throw error;
    }
  }

  async register(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.usersService.findOneByEmail(createUserDto.email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const newUser = await this.usersService.create({
        ...createUserDto,
        password: hashedPassword,
      });
      return newUser;
    } catch (error) {
      this.logger.error('Error during registration', error.stack);
      throw error;
    }
  }

  async generateRefreshToken(user: any) {
    const refreshToken = this.jwtService.sign({ sub: user.id }, { secret: process.env.JWT_SECRET, expiresIn: '7d' });
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const newRefreshToken = this.refreshTokenRepository.create({
      token: refreshToken,
      user,
      expiresAt,
    });

    await this.refreshTokenRepository.save(newRefreshToken);
    return refreshToken;
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { refreshToken } = refreshTokenDto;
      const existingToken = await this.refreshTokenRepository.findOne({ where: { token: refreshToken }, relations: ['user'] });

      if (!existingToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      if (existingToken.expiresAt < new Date()) {
        throw new UnauthorizedException('Refresh token expired');
      }

      const user = existingToken.user;
      const payload: JwtPayload = { email: user.email, sub: user.id };
      const accessToken = this.jwtService.sign(payload, { secret: process.env.JWT_SECRET, expiresIn: '15m' });
      const newRefreshToken = await this.generateRefreshToken(user);

      await this.refreshTokenRepository.remove(existingToken);

      return {
        access_token: accessToken,
        refresh_token: newRefreshToken,
      };
    } catch (error) {
      this.logger.error('Error during token refresh', error.stack);
      throw error;
    }
  }
}