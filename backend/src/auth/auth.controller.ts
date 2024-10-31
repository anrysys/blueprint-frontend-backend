// src/auth/auth.controller.ts

import { Body, Controller, HttpException, HttpStatus, Logger, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { User } from '../users/user.entity';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const user = await this.authService.register(createUserDto);
      const tokens = await this.authService.generateTokens(user);
      this.logger.log(`Tokens generated on backend (auth/register): ${JSON.stringify(tokens)}`);
      res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });
      res.cookie('access_token', tokens.accessToken, { httpOnly: true });
      return res.json({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
    } catch (error) {
      this.logger.error(`Registration error: ${error.message}`);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    try {
      const tokens = await this.authService.login(loginUserDto);
      this.logger.log(`Tokens generated on backend (auth/login): ${JSON.stringify(tokens)}`);
      res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });
      res.cookie('access_token', tokens.accessToken, { httpOnly: true });
      return res.json({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
    } catch (error) {
      this.logger.error(`Login error: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }, @Req() req: Request, @Res() res: Response) {
    try {
      const { refreshToken } = body;
      const userId = req.body.userId;

      if (await this.authService.validateRefreshToken(userId, refreshToken)) {
        const tokens = await this.authService.generateTokens({ id: userId } as User);
        res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });
        res.cookie('access_token', tokens.accessToken, { httpOnly: true });
        return res.json({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
      } else {
        return res.status(401).json({ message: 'Invalid refresh token' });
      }
    } catch (error) {
      this.logger.error(`Refresh error: ${error.message}`);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = req.body.userId;
      await this.authService.revokeRefreshToken(userId);
      res.clearCookie('refresh_token');
      res.clearCookie('access_token');
      return res.json({ message: 'Logged out successfully' });
    } catch (error) {
      this.logger.error(`Logout error: ${error.message}`);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}