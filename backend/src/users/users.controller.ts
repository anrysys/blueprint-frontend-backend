// src/user/user.controller.ts

import { Body, Controller, Get, Logger, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UserPayload } from '../auth/interfaces/user.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request & { user: UserPayload }) {
    try {
      const userId = req.user.id;
      this.logger.log(`GET /user/profile - User ID: ${userId}`); // Логирование ID пользователя (GET)
      this.logger.log(`GET /user/profile - Headers: ${JSON.stringify(req.headers)}`); // Логирование заголовков запроса
      return this.usersService.findById(userId);
    } catch (error) {
      this.logger.error(`Error in GET /user/profile: ${error.message}`); // Логирование ошибки
      throw new Error('Failed to get profile');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(@Req() req: Request & { user: UserPayload }, @Body() updateUserDto: UpdateUserDto) {
    try {
      const userId = req.user.id;
      this.logger.log(`PUT /user/profile - User ID: ${userId}`); // Логирование ID пользователя (PUT)
      this.logger.log(`PUT /user/profile - Headers: ${JSON.stringify(req.headers)}`); // Логирование заголовков запроса
      this.logger.log(`PUT /user/profile - Body: ${JSON.stringify(updateUserDto)}`); // Логирование тела запроса
      const updatedUser = await this.usersService.update(userId, updateUserDto);
      this.logger.log(`User updated: ${JSON.stringify(updatedUser)}`); // Логирование обновленного пользователя
      return updatedUser;
    } catch (error) {
      this.logger.error(`Error in PUT /user/profile: ${error.message}`); // Логирование ошибки
      throw new Error('Failed to update profile');
    }
  }
}