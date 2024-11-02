import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('subscribe')
  async subscribe(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    try {
      return await this.notificationsService.subscribe(createSubscriptionDto);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('unsubscribe')
  async unsubscribe(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    try {
      return await this.notificationsService.unsubscribe(createSubscriptionDto);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
