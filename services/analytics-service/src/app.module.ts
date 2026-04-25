import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient } from '@clickhouse/client';
import { AnalyticsController } from './analytics/analytics.controller';
import { AnalyticsService } from './analytics/analytics.service';

const CLICKHOUSE_CLIENT = 'CLICKHOUSE_CLIENT';

@Global()
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [
    {
      provide: CLICKHOUSE_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        createClient({
          url: config.get<string>('CLICKHOUSE_URL', 'http://localhost:8123'),
          database: config.get<string>('CLICKHOUSE_DB', 'intent_analytics'),
          username: config.get<string>('CLICKHOUSE_USER', 'default'),
          password: config.get<string>('CLICKHOUSE_PASSWORD', ''),
        }),
    },
    AnalyticsService,
  ],
  controllers: [AnalyticsController],
  exports: [CLICKHOUSE_CLIENT],
})
export class AppModule {}
