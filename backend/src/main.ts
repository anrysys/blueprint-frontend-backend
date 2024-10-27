import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { AppModule } from './app.module';

// Загрузка переменных окружения из файла .env
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Вывод переменных окружения в консоль
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('JWT Secret:', process.env.JWT_SECRET);

  // Включение глобальной валидации
  app.useGlobalPipes(new ValidationPipe());

  // Настройка CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL, // 'http://localhost:3000' Разрешить запросы с этого домена
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.BACKEND_PORT ?? 4000);
}
bootstrap();