import { Injectable, OnModuleInit } from '@nestjs/common';
import { ThrottlerStorage } from '@nestjs/throttler';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ThrottlerStorageRedisService implements ThrottlerStorage, OnModuleInit {
    private redis: Redis;

    constructor(private configService: ConfigService) {
        const redisUrl = this.configService.get<string>('REDIS_URL');
        if (redisUrl) {
            this.redis = new Redis(redisUrl);
        } else {
            this.redis = new Redis({
                host: this.configService.get('REDIS_HOST') || 'localhost',
                port: parseInt(this.configService.get('REDIS_PORT') || '6379'),
            });
        }
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
