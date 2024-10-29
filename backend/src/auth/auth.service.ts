// src/auth/auth.service.ts

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RedisService } from '../redis/redis.service';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';

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
      user.password = hashedPassword;
      return this.usersService.create(user);
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
      if (user && await bcrypt.compare(password, user.password)) {
        return user;
      }
      return null;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = { username: user.username, sub: user.id };
      const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

      await this.redisService.set(`refresh_token:${user.id}`, refreshToken, 7 * 24 * 60 * 60); // 7 дней

      return { accessToken, refreshToken };
    } catch (error) {
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