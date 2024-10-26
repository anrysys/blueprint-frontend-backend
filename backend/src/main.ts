import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { AppModule } from './app.module';

// Загрузка переменных окружения из файла .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  await app.listen(process.env.BACKEND_PORT ?? 4000);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();