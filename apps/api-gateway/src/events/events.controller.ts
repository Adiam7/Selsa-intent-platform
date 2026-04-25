import {
  Controller,
  Post,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  Version,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { EventsService } from './events.service';
import { TrackEventDto } from './dto/track-event.dto';
import { BatchTrackEventDto } from './dto/batch-track-event.dto';

@ApiTags('events')
@ApiBearerAuth()
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('track')
  @Version('1')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Track a single user event' })
  @ApiResponse({ status: 202, description: 'Event accepted' })
  async track(@Body() dto: TrackEventDto, @Req() req: Request) {
    await this.eventsService.track({
      ...dto,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
    return { status: 'accepted' };
  }

  @Post('batch')
  @Version('1')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Track multiple events in one request (max 100)' })
  @ApiResponse({ status: 202, description: 'Events accepted' })
  async trackBatch(@Body() dto: BatchTrackEventDto, @Req() req: Request) {
    await this.eventsService.trackBatch(dto.events, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
    return { status: 'accepted', count: dto.events.length };
  }
}
