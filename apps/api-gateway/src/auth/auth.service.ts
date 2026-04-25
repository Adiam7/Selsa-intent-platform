import {
  BadGatewayException,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly authServiceUrl =
    process.env.AUTH_SERVICE_URL ?? 'http://localhost:3010';

  async register(body: Record<string, unknown>) {
    return this.forward('register', body);
  }

  async login(body: Record<string, unknown>) {
    return this.forward('login', body);
  }

  private async forward(path: 'register' | 'login', body: Record<string, unknown>) {
    try {
      const response = await fetch(`${this.authServiceUrl}/auth/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new HttpException(
          payload?.message ?? 'Auth request failed',
          response.status,
        );
      }

      return payload;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Failed to call auth-service /auth/${path}`);
      throw new BadGatewayException('Unable to process auth request');
    }
  }
}
