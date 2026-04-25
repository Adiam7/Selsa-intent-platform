import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IntentScore } from '@intent/common-types';

@Injectable()
export class IntentService {
  private readonly logger = new Logger(IntentService.name);
  private readonly intentEngineUrl = process.env.INTENT_ENGINE_URL ?? 'http://localhost:3003';

  constructor(private readonly httpService: HttpService) {}

  async getIntent(userId: string): Promise<IntentScore | null> {
    this.logger.debug(`[getIntent] userId=${userId}`);
    try {
      const response = await firstValueFrom(
        this.httpService.get<IntentScore>(`${this.intentEngineUrl}/v1/intent/${userId}`)
          .pipe(
            catchError(() => {
              this.logger.warn(`[getIntent] intent-engine unavailable for userId=${userId}`);
              throw new HttpException(
                'Intent engine unavailable',
                HttpStatus.SERVICE_UNAVAILABLE,
              );
            }),
          ),
      );
      return response.data ?? null;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`[getIntent] error: ${msg}`);
      throw error;
    }
  }
}
