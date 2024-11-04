// src/user/user.service.ts

import { BadRequestException, HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponse } from './dto/user-response.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(createUserDto);
      const savedUser = await this.userRepository.save(user);
      return savedUser;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      return user;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOneById(id: number): Promise<User | undefined> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      return user;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

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

  toUserResponse(user: User): UserResponse {
    const { id, username, email } = user;
    return { id, username, email };
  }  
}