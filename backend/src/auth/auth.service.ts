import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { RedisService } from '../redis/redis.service'; // Импорт RedisService
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

dotenv.config(); // Загрузка переменных из .env

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly redisService: RedisService, 
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = new User();
      user.username = createUserDto.username;
      user.email = createUserDto.email;
      user.password = hashedPassword;
      const createdUser = await this.usersService.create(user);
      return createdUser;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const user = await this.validateUser(loginUserDto.email, loginUserDto.password);
      if (!user) {
        throw new Error('Invalid credentials');
      }
      const tokens = await this.generateTokens(user);
      return tokens;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.usersService.findOneByEmail(email);
      if (!user) {
        return null;
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return null;
      }
      return user;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = { username: user.username, sub: user.id, email: user.email };
      const accessToken = this.jwtService.sign(payload, { expiresIn: process.env.ACCESS_TOKEN_EXPIRED_IN || '15m' });
      const refreshToken = this.jwtService.sign(payload, { expiresIn: process.env.REFRESH_TOKEN_EXPIRED_IN || '7d' });
      return { accessToken, refreshToken };
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async validateRefreshToken(userId: number, refreshToken: string): Promise<{ isValid: boolean, user?: User }> {
    try {
      const user = await this.usersService.findOneById(userId);
      if (!user) {
        return { isValid: false };
      }
      const payload = this.jwtService.verify(refreshToken);
      return { isValid: payload.sub === user.id, user: payload.sub === user.id ? user : undefined };
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  getUserIdFromToken(token: string): number {
    try {
      const payload = this.jwtService.verify(token);
      return payload.sub;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserById(userId: number): Promise<User> {
    try {
      const user = await this.usersService.findOneById(userId);
      if (user) {
        return user;
      }
      return undefined;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateRefreshTokenInRedis(userId: number, refreshToken: string): Promise<void> {
    try {
      await this.redisService.set(`refresh_token:${userId}`, refreshToken);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async revokeRefreshToken(userId: string): Promise<void> {
    try {
      await this.redisService.del(`refresh_token:${userId}`);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}