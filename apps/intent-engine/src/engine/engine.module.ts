import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntentScoreEntity } from './entities/intent-score.entity';
import { IntentController } from './intent.controller';
import { IntentService } from './intent.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([IntentScoreEntity]), RedisModule],
  controllers: [IntentController],
  providers: [IntentService],
  exports: [IntentService],
})
export class EngineModule {}
