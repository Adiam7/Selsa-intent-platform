import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { IntentService } from './intent.service';

@Controller('intent')
export class IntentController {
  constructor(private readonly intentService: IntentService) {}

  @Get(':userId')
  async get(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.intentService.getIntent(userId);
  }
}
