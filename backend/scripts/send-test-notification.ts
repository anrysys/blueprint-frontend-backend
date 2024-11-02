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
      await notificationsService.sendNotification(subscription, payload);
    }

    await app.close();
    console.log('Notifications sent successfully.');
  } catch (error) {
    console.error('Error sending test notifications:', error);
  }
}

bootstrap();
