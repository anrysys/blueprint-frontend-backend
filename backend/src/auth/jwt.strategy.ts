// src/auth/jwt.strategy.ts
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as dotenv from 'dotenv';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

dotenv.config(); // Загрузка конфигурации из .env

// ! проверяется валидность токена, который приходит от клиента
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey',
    });
  }

  async validate(payload: any) {
    this.logger.log(`JwtStrategy validate called with payload: ${JSON.stringify(payload)}`);
    const user = await this.usersService.findOneByEmail(payload.email);
    if (!user) {
      this.logger.error('JwtStrategy validate: user not found');
      throw new UnauthorizedException();
    }
    this.logger.log(`JwtStrategy validate: user found ${JSON.stringify(user)}`);
    return user;
  }
}