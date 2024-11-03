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

    console.log('Testing delete all subscriptions...');

    // Получаем все подписки перед удалением
    const subscriptionsBefore = await notificationsService.getAllSubscriptions();
    console.log('Subscriptions before deletion:', subscriptionsBefore);

    // Удаляем все подписки
    await notificationsService.deleteAllSubscriptions();

    // Получаем все подписки после удаления
    const subscriptionsAfter = await notificationsService.getAllSubscriptions();
    console.log('Subscriptions after deletion:', subscriptionsAfter);
  } catch (error) {
    console.error('Error testing delete all subscriptions:', error);
  } finally {
    process.exit();
  }
}

bootstrap();
