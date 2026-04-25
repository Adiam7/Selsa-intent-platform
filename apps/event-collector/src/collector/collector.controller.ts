import {
  Controller,
  Post,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { Request } from 'express';
import { ZodValidationPipe } from '@intent/validation';
import {
  TrackEventSchema,
  BatchTrackEventSchema,
  TrackEventInput,
  BatchTrackEventInput,
} from '@intent/event-schemas';
import { CollectorService } from './collector.service';

@Controller('collect')
export class CollectorController {
  constructor(private readonly collectorService: CollectorService) {}

  @Post('event')
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(new ZodValidationPipe(TrackEventSchema))
  async track(@Body() dto: TrackEventInput, @Req() req: Request) {
    await this.collectorService.track({
      ...dto,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
    return { status: 'accepted' };
  }

  @Post('batch')
  @HttpCode(HttpStatus.ACCEPTED)
  @UsePipes(new ZodValidationPipe(BatchTrackEventSchema))
  async trackBatch(@Body() dto: BatchTrackEventInput, @Req() req: Request) {
    await this.collectorService.trackBatch(dto.events, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
    return { status: 'accepted', count: dto.events.length };
  }
}
