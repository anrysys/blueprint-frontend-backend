import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as webpush from 'web-push';
import { User } from '../users/user.entity';
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
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    if (!process.env.VAPID_MAILTO || !process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
      throw new Error('VAPID details are not set in environment variables');
    }
    webpush.setVapidDetails(
      process.env.VAPID_MAILTO,
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY,
    );
  }

  setVapidDetails(subject: string, publicKey: string, privateKey: string) {
    webpush.setVapidDetails(subject, publicKey, privateKey);
  }

  async subscribe(userId: number, subscription: any): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const existingSubscription = await this.subscriptionRepository.findOne({
      where: { user, endpoint: subscription.endpoint },
    });

    if (!existingSubscription) {
      const newSubscription = this.subscriptionRepository.create({
        user,
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      });
      await this.subscriptionRepository.save(newSubscription);
    }
  }

  async unsubscribe(createSubscriptionDto: CreateSubscriptionDto): Promise<void> {
    try {
      const subscription = await this.subscriptionRepository.findOne({
        where: { endpoint: createSubscriptionDto.endpoint },
      });

      if (subscription) {
        await this.subscriptionRepository.remove(subscription);
      }
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

  async resetSubscriptionSequence(): Promise<void> {
    try {
      await this.subscriptionRepository.query('ALTER SEQUENCE subscription_id_seq RESTART WITH 1');
      this.logger.log('Subscription ID sequence reset successfully');
    } catch (error) {
      this.logger.error('Error resetting subscription ID sequence:', error);
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
