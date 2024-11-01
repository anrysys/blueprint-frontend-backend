// src/user/user.service.ts

import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new Error('Failed to find user by id');
    }
  }

  async update(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      this.logger.log(`Updating user with ID: ${userId}`); // Логирование ID пользователя
      this.logger.log(`Update data: ${JSON.stringify(updateUserDto)}`); // Логирование данных обновления

      if (!updateUserDto.email) {
        throw new BadRequestException('Email cannot be empty');
      }

      await this.userRepository.update(userId, updateUserDto);
      const updatedUser = await this.userRepository.findOne({ where: { id: userId } });
      this.logger.log(`Updated user: ${JSON.stringify(updatedUser)}`); // Логирование обновленного пользователя
      return updatedUser;
    } catch (error) {
      this.logger.error(`Error updating user: ${error.message}`); // Логирование ошибки
      throw new Error('Failed to update user');
    }
  }
}