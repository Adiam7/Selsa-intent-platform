import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);
  private readonly analyticsServiceUrl = process.env.ANALYTICS_SERVICE_URL ?? 'http://localhost:3013';

  constructor(private readonly httpService: HttpService) {}

  async query(body: Record<string, unknown>) {
    this.logger.debug('[query]', body);
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.analyticsServiceUrl}/v1/analytics/query`, body)
          .pipe(
            catchError(() => {
              throw new HttpException(
                'Analytics service unavailable',
                HttpStatus.SERVICE_UNAVAILABLE,
              );
            }),
          ),
      );
      return response.data ?? { rows: [] };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`[query] error: ${msg}`);
      throw error;
    }
  }

  async funnel(body: Record<string, unknown>) {
    this.logger.debug('[funnel]', body);
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.analyticsServiceUrl}/v1/analytics/funnel`, body)
          .pipe(
            catchError(() => {
              throw new HttpException(
                'Analytics service unavailable',
                HttpStatus.SERVICE_UNAVAILABLE,
              );
            }),
          ),
      );
      return response.data ?? { steps: [] };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`[funnel] error: ${msg}`);
      throw error;
    }
  }
}
