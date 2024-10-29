// src/auth/auth.controller.ts
import { Body, Controller, HttpException, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { User } from '../users/user.entity';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const user = await this.authService.register(createUserDto);
      return res.json(user);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('login')
  async login(@Body() user: User, @Res() res: Response) {
    try {
      const tokens = await this.authService.generateTokens(user);
      res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });
      return res.json({ accessToken: tokens.accessToken });
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    try {
      const refreshToken = req.cookies['refresh_token'];
      const userId = req.body.userId;

      if (await this.authService.validateRefreshToken(userId, refreshToken)) {
        const tokens = await this.authService.generateTokens({ id: userId } as User);
        res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });
        return res.json({ accessToken: tokens.accessToken });
      } else {
        return res.status(401).json({ message: 'Invalid refresh token' });
      }
    } catch (error) {
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
      return res.json({ message: 'Logged out successfully' });
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}