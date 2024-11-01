// src/users/users.service.ts

import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { User } from './user.entity';
import { UserResponse } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(createUserDto);
      const savedUser = await this.userRepository.save(user);
      this.logger.log(`User created: ${JSON.stringify(savedUser)}`);
      return savedUser;
    } catch (error) {
      this.logger.error(`Create user error: ${error.message}`);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      this.logger.log(`User found by email: ${JSON.stringify(user)}`);
      return user ? plainToInstance(User, user) : undefined;
    } catch (error) {
      this.logger.error(`Find user by email error: ${error.message}`);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOneById(id: number): Promise<User | undefined> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      this.logger.log(`User found by ID: ${JSON.stringify(user)}`);
      return user ? plainToInstance(User, user) : undefined;
    } catch (error) {
      this.logger.error(`Find user by ID error: ${error.message}`);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  toUserResponse(user: User): UserResponse {
    const { id, username, email } = user;
    return { id, username, email };
  }
}