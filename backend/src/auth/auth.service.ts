// src/auth/auth.service.ts

import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { RedisService } from '../redis/redis.service';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

dotenv.config(); // Загрузка конфигурации из .env

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

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
      this.logger.log(`User created: ${JSON.stringify(createdUser)}`); // Логирование созданного пользователя
      return createdUser;
    } catch (error) {
      this.logger.error(`Registration error: ${error.message}`); // Логирование ошибки
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
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }
      const tokens = await this.generateTokens(user);
      this.logger.log(`Tokens generated for user ${user.id}: ${JSON.stringify(tokens)}`); // Логирование токенов
      return tokens;
    } catch (error) {
      this.logger.error(`Login error: ${error.message}`); // Логирование ошибки
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.usersService.findOneByEmail(email);
      if (user && await bcrypt.compare(password, user.password)) {
        return user;
      }
      return null;
    } catch (error) {
      this.logger.error(`Validation error: ${error.message}`); // Логирование ошибки
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

      // Сохранение refresh_token в Redis с ограничением времени жизни
      const refreshTokenExpiry = parseInt(process.env.REFRESH_TOKEN_MAXAGE, 10) || 7 * 24 * 60 * 60; // 7 дней в секундах
      await this.redisService.set(`refresh_token:${user.id}`, refreshToken, refreshTokenExpiry);

      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error(`Token generation error: ${error.message}`); // Логирование ошибки
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async validateRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
    try {
      const storedToken = await this.redisService.get(`refresh_token:${userId}`);
      return storedToken === refreshToken;
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