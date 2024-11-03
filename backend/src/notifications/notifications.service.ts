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

  async subscribe(createSubscriptionDto: CreateSubscriptionDto): Promise<Subscription> {
    try {
      this.logger.log('Received subscription:', createSubscriptionDto);
      if (!createSubscriptionDto.keys || !createSubscriptionDto.keys.p256dh || !createSubscriptionDto.keys.auth) {
        throw new HttpException('Subscription keys are missing or invalid', HttpStatus.BAD_REQUEST);
      }
      if (createSubscriptionDto.keys.p256dh.length !== 88) {
        throw new HttpException('Invalid p256dh key length', HttpStatus.BAD_REQUEST);
      }

      // Check if subscription already exists by endpoint
      const existingSubscriptionByEndpoint = await this.subscriptionRepository.findOne({
        where: { endpoint: createSubscriptionDto.endpoint },
      });

      if (existingSubscriptionByEndpoint) {
        this.logger.log('Subscription already exists with matching endpoint:', existingSubscriptionByEndpoint);
        return existingSubscriptionByEndpoint;
      }

      // Check if subscription already exists by keys
      const existingSubscriptionByKeys = await this.subscriptionRepository.createQueryBuilder('subscription')
        .where('subscription.keys->>\'p256dh\' = :p256dh AND subscription.keys->>\'auth\' = :auth', { 
          p256dh: createSubscriptionDto.keys.p256dh, 
          auth: createSubscriptionDto.keys.auth 
        })
        .getOne();

      if (existingSubscriptionByKeys) {
        this.logger.log('Subscription already exists with matching keys:', existingSubscriptionByKeys);
        return existingSubscriptionByKeys;
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
