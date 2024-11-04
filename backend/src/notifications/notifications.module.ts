// src/notifications/notifications.module.ts

import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationsService } from './notifications.service';

import { NotificationsController } from './notifications.controller';

import { Subscription } from './subscription.entity';



@Module({

  imports: [TypeOrmModule.forFeature([Subscription])],

  providers: [NotificationsService],

  controllers: [NotificationsController],

})

export class NotificationsModule {}
