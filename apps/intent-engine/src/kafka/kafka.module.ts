import { Module } from '@nestjs/common';
import { IntentConsumer } from './intent-consumer';
import { EventCacheService } from './event-cache.service';
import { RedisModule } from '../redis/redis.module';
import { EngineModule } from '../engine/engine.module';

@Module({
  imports: [RedisModule, EngineModule],
  providers: [IntentConsumer, EventCacheService],
  exports: [EventCacheService],
})
export class KafkaModule {}
