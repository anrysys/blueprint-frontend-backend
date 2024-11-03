import { NestFactory } from '@nestjs/core';
import * as path from 'path';
import { AppModule } from '../src/app.module';
import { NotificationsService } from '../src/notifications/notifications.service';

// Add .env file support
import { config } from 'dotenv';
config({ path: path.resolve(__dirname, '../.env') });

async function bootstrap() {
  console.log('VAPID_PUBLIC_KEY:', process.env.VAPID_PUBLIC_KEY);
  console.log('VAPID_PRIVATE_KEY:', process.env.VAPID_PRIVATE_KEY);

  try {
    if (!process.env.VAPID_MAILTO || !process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
      throw new Error('VAPID details are not set in environment variables');
    }

    const app = await NestFactory.createApplicationContext(AppModule);
    const notificationsService = app.get(NotificationsService);

    console.log('Sending test notifications...');

    // Убедимся, что VAPID ключи установлены
    notificationsService.setVapidDetails(
      process.env.VAPID_MAILTO,
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );

    const subscriptions = await notificationsService.getAllSubscriptions();
    console.log('Subscriptions:', subscriptions);

    const payload = {
      title: 'Test Notification',
      body: 'This is a test notification',
    };

    for (const subscription of subscriptions) {
      console.log('Sending notification to:', subscription);
      if (subscription.keys.p256dh.length !== 88) {
        console.error('Invalid p256dh key length:', subscription.keys.p256dh.length);
        continue;
      }
      try {
        await notificationsService.sendNotification(subscription, payload);
      } catch (error) {
        console.error('Error sending notification to:', subscription.endpoint, error);
      }
    }

    await app.close();
    console.log('Notifications sent successfully.');
  } catch (error) {
    console.error('Error sending test notifications:', error);
  }
}

bootstrap();
