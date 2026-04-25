import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class SegmentsService {
  private readonly logger = new Logger(SegmentsService.name);
  private readonly segmentationServiceUrl = process.env.SEGMENTATION_SERVICE_URL ?? 'http://localhost:3012';

  constructor(private readonly httpService: HttpService) {}

  async list() {
    this.logger.debug('[list] segments');
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.segmentationServiceUrl}/v1/segments`)
          .pipe(
            catchError(() => {
              throw new HttpException(
                'Segmentation service unavailable',
                HttpStatus.SERVICE_UNAVAILABLE,
              );
            }),
          ),
      );
      return response.data ?? [];
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`[list] error: ${msg}`);
      throw error;
    }
  }

  async create(body: Record<string, unknown>) {
    this.logger.debug(`[create] segment`, body);
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.segmentationServiceUrl}/v1/segments`, body)
          .pipe(
            catchError(() => {
              throw new HttpException(
                'Segmentation service unavailable',
                HttpStatus.SERVICE_UNAVAILABLE,
              );
            }),
          ),
      );
      return response.data ?? null;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`[create] error: ${msg}`);
      throw error;
    }
  }

  async getUsers(segmentId: string) {
    this.logger.debug(`[getUsers] segmentId=${segmentId}`);
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.segmentationServiceUrl}/v1/segments/${segmentId}/users`)
          .pipe(
            catchError(() => {
              throw new HttpException(
                'Segmentation service unavailable',
                HttpStatus.SERVICE_UNAVAILABLE,
              );
            }),
          ),
      );
      return response.data ?? [];
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`[getUsers] error: ${msg}`);
      throw error;
    }
  }
}
