import { Controller, Post, Body } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('query')
  query(@Body() body: Record<string, unknown>) {
    return this.analyticsService.queryEvents(body as never);
  }

  @Post('funnel')
  funnel(@Body() body: { steps: string[]; startDate: string; endDate: string }) {
    return this.analyticsService.getFunnel(body.steps, body.startDate, body.endDate);
  }
}
