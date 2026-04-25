import {
  BadGatewayException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly userServiceUrl = process.env.USER_SERVICE_URL ?? 'http://localhost:3011';

  constructor(private readonly httpService: HttpService) {}

  async getProfile(id: string) {
    this.logger.debug(`[getProfile] userId=${id}`);
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.userServiceUrl}/v1/users/${id}`)
          .pipe(
            catchError(() => {
              throw new HttpException(
                'User service unavailable',
                HttpStatus.SERVICE_UNAVAILABLE,
              );
            }),
          ),
      );
      return response.data ?? null;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`[getProfile] error: ${msg}`);
      throw error;
    }
  }

  async getTimeline(id: string) {
    this.logger.debug(`[getTimeline] userId=${id}`);
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.userServiceUrl}/v1/users/${id}/timeline`)
          .pipe(
            catchError(() => {
              throw new HttpException(
                'User service unavailable',
                HttpStatus.SERVICE_UNAVAILABLE,
              );
            }),
          ),
      );
      return response.data ?? [];
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`[getTimeline] error: ${msg}`);
      throw error;
    }
  }

  async updateIntents(id: string, intents: string[]) {
    this.logger.debug(`[updateIntents] userId=${id}, intents=${intents.join(',')}`);

    try {
      const response = await fetch(`${this.userServiceUrl}/users/${id}/intents`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intents }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new HttpException(
          payload?.message ?? 'Failed to update intents',
          response.status,
        );
      }

      return payload;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`[updateIntents] user-service unavailable for ${id}`);
      throw new BadGatewayException('Unable to update intents');
    }
  }
}
