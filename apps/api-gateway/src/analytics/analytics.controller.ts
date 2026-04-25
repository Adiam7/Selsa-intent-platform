import { Controller, Post, Body, Version } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@ApiBearerAuth()
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('query')
  @Version('1')
  @ApiOperation({ summary: 'Run an analytics query over the event warehouse' })
  async query(@Body() body: Record<string, unknown>) {
    return this.analyticsService.query(body);
  }

  @Post('funnel')
  @Version('1')
  @ApiOperation({ summary: 'Compute a conversion funnel' })
  async funnel(@Body() body: Record<string, unknown>) {
    return this.analyticsService.funnel(body);
  }
}
