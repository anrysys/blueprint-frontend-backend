// src/redis/redis.service.ts

import { Injectable, Logger } from '@nestjs/common';
import * as Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly client: Redis.Redis;
  private readonly logger = new Logger(RedisService.name);
  
  constructor() {
    this.client = new Redis.default({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10),
    });
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.set(key, value, 'EX', ttl);
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    const value = await this.client.get(key);
    this.logger.log(`GET ${key}: ${value}`); // Логирование значения ключа
    return value;
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}