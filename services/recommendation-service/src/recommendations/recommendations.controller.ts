import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';

@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recService: RecommendationsService) {}

  @Get(':userId')
  getForUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.recService.getForUser(userId);
  }
}
