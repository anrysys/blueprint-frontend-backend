import { Body, Controller, Delete, HttpException, HttpStatus, Logger, Post } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('subscribe')
  async subscribe(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    try {
      this.logger.log('Received subscription request:', createSubscriptionDto);
      return await this.notificationsService.subscribe(createSubscriptionDto);
    } catch (error) {
      this.logger.error('Error in subscribe endpoint:', error);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('unsubscribe')
  async unsubscribe(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    try {
      this.logger.log('Received unsubscribe request:', createSubscriptionDto);
      return await this.notificationsService.unsubscribe(createSubscriptionDto);
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
