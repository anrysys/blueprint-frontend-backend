import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { UsersService } from './users.service';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = req.user.id;
      const user = await this.usersService.findOneById(userId);
      if (user) {
        const { password, ...userWithoutPassword } = user;
        return res.json(userWithoutPassword);
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
