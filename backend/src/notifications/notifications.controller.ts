import { Body, Controller, Delete, HttpException, HttpStatus, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('subscribe')
  async subscribe(@Body() subscription: any, @Req() req: any) {
    try {
      const userId = req.user.id;
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new HttpException('No auth token provided', HttpStatus.UNAUTHORIZED);
      }
      this.logger.log('Received subscription request:', subscription);
      return await this.notificationsService.subscribe(userId, subscription);
    } catch (error) {
      this.logger.error('Error in subscribe endpoint:', error);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('unsubscribe')
  async unsubscribe(@Body() createSubscriptionDto: CreateSubscriptionDto, @Req() req: any) {
    try {
      const userId = req.user.id;
      this.logger.log('Received unsubscribe request for user:', userId);
      return await this.notificationsService.unsubscribeAllForUser(userId);
    } catch (error) {
      this.logger.error('Error in unsubscribe endpoint:', error);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('delete-all')
  async deleteAllSubscriptions() {
    try {
      this.logger.log('Received request to delete all subscriptions');
      await this.notificationsService.deleteAllSubscriptions();
      return { message: 'All subscriptions deleted successfully' };
    } catch (error) {
      this.logger.error('Error in delete-all endpoint:', error);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
