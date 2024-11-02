import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { User } from './user.entity'; // Импортируем сущность User
import { UsersService } from './users.service';

interface AuthenticatedRequest extends Request {
  user: User; // Добавляем типизацию для req.user
}

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    try {
      const userId = req.user.id;
      const user = await this.usersService.findOneById(userId);
      if (user) {
        const userWithoutPassword = user.toJSON();
        return res.json(userWithoutPassword);
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}