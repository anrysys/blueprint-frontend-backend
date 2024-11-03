import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { NotificationsService } from '../src/notifications/notifications.service';

async function bootstrap() {
  try {
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
