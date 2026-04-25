import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  getUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id);
  }

  @Get(':id/events')
  getUserEvents(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('limit') limit = '50',
    @Query('offset') offset = '0',
  ) {
    return this.usersService.getEvents(id, parseInt(limit, 10), parseInt(offset, 10));
  }

  @Get(':id/sessions')
  getUserSessions(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getSessions(id);
  }

  @Put(':id/intents')
  updateUserIntents(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { intents: string[] },
  ) {
    return this.usersService.updateDeclaredIntents(id, body.intents ?? []);
  }
}
