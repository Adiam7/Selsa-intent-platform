import { Controller, Get, Param, ParseUUIDPipe, Version } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { IntentService } from './intent.service';

@ApiTags('intent')
@ApiBearerAuth()
@Controller('intent')
export class IntentController {
  constructor(private readonly intentService: IntentService) {}

  @Get(':userId')
  @Version('1')
  @ApiOperation({ summary: 'Get the current intent score for a user' })
  @ApiResponse({ status: 200, description: 'Intent score returned' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getIntent(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.intentService.getIntent(userId);
  }
}
