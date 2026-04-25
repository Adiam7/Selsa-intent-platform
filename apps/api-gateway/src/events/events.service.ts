import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { TrackEventDto } from './dto/track-event.dto';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);
  private readonly eventCollectorUrl = process.env.EVENT_COLLECTOR_URL ?? 'http://localhost:3002';

  constructor(private readonly httpService: HttpService) {}

  async track(dto: TrackEventDto & { ip?: string; userAgent?: string }): Promise<void> {
    this.logger.debug(`[track] ${dto.eventType} for user ${dto.userId}`);
    try {
      await firstValueFrom(
        this.httpService.post(`${this.eventCollectorUrl}/v1/collector/event`, {
          ...dto,
          ip: dto.ip,
          userAgent: dto.userAgent,
        }),
      );
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`[track] failed to forward event: ${msg}`);
      throw new HttpException(
        'Failed to track event',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async trackBatch(
    events: TrackEventDto[],
    context: { ip?: string; userAgent?: string },
  ): Promise<void> {
    this.logger.debug(`[trackBatch] ${events.length} events`);
    try {
      await firstValueFrom(
        this.httpService.post(`${this.eventCollectorUrl}/v1/collector/batch`, {
          events: events.map(e => ({
            ...e,
            ip: context.ip,
            userAgent: context.userAgent,
          })),
        }),
      );
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`[trackBatch] failed to forward events: ${msg}`);
      throw new HttpException(
        'Failed to track batch',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
