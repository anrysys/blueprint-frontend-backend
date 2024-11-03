import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { NotificationsService } from '../src/notifications/notifications.service';

async function bootstrap() {
  try {
    if (!process.env.VAPID_MAILTO || !process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
      throw new Error('VAPID details are not set in environment variables');
    }

    const app = await NestFactory.createApplicationContext(AppModule);
    const notificationsService = app.get(NotificationsService);

    console.log('Deleting all subscriptions...');
    await notificationsService.deleteAllSubscriptions();
    console.log('All subscriptions deleted successfully');
  } catch (error) {
    console.error('Error deleting all subscriptions:', error);
  } finally {
    process.exit();
  }
}

bootstrap();
