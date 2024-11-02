import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import * as Redis from 'ioredis';

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => {
    return {
      set: jest.fn(),
      get: jest.fn(),
      del: jest.fn(),
    };
  });
});

describe('RedisService', () => {
  let service: RedisService;
  let redisClient: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisService],
    }).compile();

    service = module.get<RedisService>(RedisService);
    redisClient = (Redis as any).mock.instances[0];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set a value with ttl', async () => {
    const key = 'test-key';
    const value = 'test-value';
    const ttl = 60;

    try {
      await service.set(key, value, ttl);
      expect(redisClient.set).toHaveBeenCalledWith(key, value, 'EX', ttl);
    } catch (error) {
      fail(`Failed to set value with ttl: ${error.message}`);
    }
  });

  it('should set a value without ttl', async () => {
    const key = 'test-key';
    const value = 'test-value';

    try {
      await service.set(key, value);
      expect(redisClient.set).toHaveBeenCalledWith(key, value);
    } catch (error) {
      fail(`Failed to set value without ttl: ${error.message}`);
    }
  });

  it('should get a value', async () => {
    const key = 'test-key';
    const value = 'test-value';
    (redisClient.get as jest.Mock).mockResolvedValue(value);

    try {
      const result = await service.get(key);
      expect(result).toBe(value);
      expect(redisClient.get).toHaveBeenCalledWith(key);
    } catch (error) {
      fail(`Failed to get value: ${error.message}`);
    }
  });

  it('should delete a key', async () => {
    const key = 'test-key';

    try {
      await service.del(key);
      expect(redisClient.del).toHaveBeenCalledWith(key);
    } catch (error) {
      fail(`Failed to delete key: ${error.message}`);
    }
  });
});
