import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventsModule } from './events/events.module';
import { IntentModule } from './intent/intent.module';
import { UsersModule } from './users/users.module';
import { SegmentsModule } from './segments/segments.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { HealthModule } from './health/health.module';
import { ListingsModule } from './listings/listings.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule.register({ timeout: 10000, maxRedirects: 5 }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 1000 }]),
    EventsModule,
    IntentModule,
    UsersModule,
    SegmentsModule,
    AnalyticsModule,
    HealthModule,
    ListingsModule,
    AuthModule,
  ],
})
export class AppModule {}
