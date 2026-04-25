import {
  BadGatewayException,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';

export interface CreateListingDto {
  intent_type: string;
  category: string;
  title: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface UpdateListingDto {
  category?: string;
  title?: string;
  description?: string;
  metadata?: Record<string, any>;
  status?: string;
}

@Injectable()
export class ListingsService {
  private readonly logger = new Logger(ListingsService.name);
  private readonly contentServiceUrl =
    process.env.CONTENT_SERVICE_URL ?? 'http://localhost:3015';

  async findAll(params: Record<string, any>) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        query.set(key, String(value));
      }
    }

    const path = `/listings${query.toString() ? `?${query.toString()}` : ''}`;
    return this.forward(path, 'GET');
  }

  async findOne(id: string) {
    return this.forward(`/listings/${id}`, 'GET');
  }

  async create(userId: string | undefined, dto: CreateListingDto) {
    return this.forward('/listings', 'POST', {
      ...dto,
      user_id: userId,
    });
  }

  async update(id: string, userId: string | undefined, dto: UpdateListingDto) {
    return this.forward(`/listings/${id}`, 'PUT', {
      ...dto,
      user_id: userId,
    });
  }

  async delete(id: string, userId: string | undefined) {
    return this.forward(`/listings/${id}`, 'DELETE', { user_id: userId });
  }

  private async forward(path: string, method: string, body?: Record<string, unknown>) {
    try {
      const response = await fetch(`${this.contentServiceUrl}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new HttpException(
          payload?.message ?? 'Content-service request failed',
          response.status,
        );
      }

      return payload;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Failed to call content-service ${method} ${path}`);
      throw new BadGatewayException('Unable to reach content-service');
    }
  }
}
