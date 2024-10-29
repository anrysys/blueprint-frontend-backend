// src/redis/redis.module.ts
import { RedisModule as NestRedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Module({
  imports: [
    NestRedisModule.forRoot({
      type: 'single',
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}