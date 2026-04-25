import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SERVICE_PORTS } from '@intent/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const port = process.env.PORT ?? SERVICE_PORTS.CONTENT_SERVICE;
  await app.listen(port);
  console.log(`📦 Content Service running on http://localhost:${port}`);
}
bootstrap();
