import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Version,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id/profile')
  @Version('1')
  @ApiOperation({ summary: 'Get user profile with intent and segment data' })
  async getProfile(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getProfile(id);
  }

  @Get(':id/timeline')
  @Version('1')
  @ApiOperation({ summary: 'Get paginated event timeline for a user' })
  async getTimeline(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getTimeline(id);
  }

  @Put(':id/intents')
  @Version('1')
  @ApiOperation({ summary: 'Update user declared intents' })
  async updateIntents(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { intents: string[] },
  ) {
    return this.usersService.updateIntents(id, body.intents ?? []);
  }
}
