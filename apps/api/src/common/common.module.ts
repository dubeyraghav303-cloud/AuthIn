import { Module, Global } from '@nestjs/common';
import { ThrottlerStorageRedisService } from './throttler/throttler-storage-redis.service';

@Global()
@Module({
    providers: [ThrottlerStorageRedisService],
    exports: [ThrottlerStorageRedisService],
})
export class CommonModule { }
