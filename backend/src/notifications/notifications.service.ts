import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as webpush from 'web-push';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Subscription } from './subscription.entity';

// Add .env file support
import { config } from 'dotenv';
config();

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {
    webpush.setVapidDetails(
      process.env.VAPID_MAILTO,
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY,
    );
  }

  setVapidDetails(subject: string, publicKey: string, privateKey: string) {
    webpush.setVapidDetails(subject, publicKey, privateKey);
  }

  async subscribe(createSubscriptionDto: CreateSubscriptionDto): Promise<Subscription> {
    try {
      this.logger.log('Received subscription:', createSubscriptionDto);
      if (!createSubscriptionDto.keys || !createSubscriptionDto.keys.p256dh) {
        throw new HttpException('Subscription keys are missing or invalid', HttpStatus.BAD_REQUEST);
      }
      if (createSubscriptionDto.keys.p256dh.length !== 88) {
        throw new HttpException('Invalid p256dh key length', HttpStatus.BAD_REQUEST);
      }
      const subscription = this.subscriptionRepository.create({
        endpoint: createSubscriptionDto.endpoint,
        keys: createSubscriptionDto.keys,
      });
      return await this.subscriptionRepository.save(subscription);
    } catch (error) {
      this.logger.error('Error subscribing:', error);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async unsubscribe(createSubscriptionDto: CreateSubscriptionDto): Promise<void> {
    try {
      await this.subscriptionRepository.delete({ endpoint: createSubscriptionDto.endpoint });
    } catch (error) {
      this.logger.error('Error unsubscribing:', error);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteAllSubscriptions(): Promise<void> {
    try {
      await this.subscriptionRepository.clear();
      this.logger.log('All subscriptions deleted successfully');
    } catch (error) {
      this.logger.error('Error deleting all subscriptions:', error);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async sendNotification(subscription: Subscription, payload: any): Promise<void> {
    try {
      await webpush.sendNotification(subscription, JSON.stringify(payload));
    } catch (error) {
      this.logger.error('Error sending notification:', error);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllSubscriptions(): Promise<Subscription[]> {
    try {
      return await this.subscriptionRepository.find();
    } catch (error) {
      this.logger.error('Error getting all subscriptions:', error);
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
