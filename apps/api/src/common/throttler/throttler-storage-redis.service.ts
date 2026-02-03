import { Injectable, OnModuleInit } from '@nestjs/common';
import { ThrottlerStorage } from '@nestjs/throttler';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ThrottlerStorageRedisService implements ThrottlerStorage, OnModuleInit {
    private redis: Redis;

    constructor(private configService: ConfigService) {
        this.redis = new Redis({
            host: 'localhost', // In prod, use configService.get('REDIS_HOST')
            port: 6379,
        });
    }

    onModuleInit() {
        // Optional: connection check
    }

    async increment(key: string, ttl: number): Promise<ThrottlerStorageRecord> {
        const totalHits = await this.redis.incr(key);
        if (totalHits === 1) {
            await this.redis.expire(key, Math.ceil(ttl / 1000));
        }
        const timeToExpire = await this.redis.ttl(key);

        return {
            totalHits,
            timeToExpire,
            isBlocked: false,
            timeToBlock: 0,
            timeToBlockExpire: 0,
        };
    }
}

interface ThrottlerStorageRecord {
    totalHits: number;
    timeToExpire: number;
    isBlocked: boolean;
    timeToBlock: number;
    timeToBlockExpire: number;
}
