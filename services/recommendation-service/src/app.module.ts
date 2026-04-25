import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RecommendationsController } from './recommendations/recommendations.controller';
import { RecommendationsService } from './recommendations/recommendations.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [RecommendationsController],
  providers: [RecommendationsService],
})
export class AppModule {}
