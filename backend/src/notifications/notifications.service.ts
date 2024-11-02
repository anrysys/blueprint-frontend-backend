import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
      const subscription = this.subscriptionRepository.create({
        endpoint: createSubscriptionDto.endpoint,
        keys: createSubscriptionDto.keys,
      });
      return await this.subscriptionRepository.save(subscription);
    } catch (error) {
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
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
