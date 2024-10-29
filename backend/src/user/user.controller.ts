// src/user/user.controller.ts

import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UserPayload } from '../auth/interfaces/user.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request & { user: UserPayload }) {
    try {
      const userId = req.user.id;
      return this.userService.findById(userId);
    } catch (error) {
      throw new Error('Failed to get profile');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(@Req() req: Request & { user: UserPayload }, @Body() updateUserDto: UpdateUserDto) {
    try {
      const userId = req.user.id;
      return this.userService.update(userId, updateUserDto);
    } catch (error) {
      throw new Error('Failed to update profile');
    }
  }
}