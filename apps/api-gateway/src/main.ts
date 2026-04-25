import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { SERVICE_PORTS } from '@intent/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());

  // CORS — restrict to configured origins
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? ['http://localhost:3000'],
    credentials: true,
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
  );

  // URI versioning  →  /v1/...
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // Swagger docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Intent Platform API')
    .setDescription('Unified API Gateway — tracks events, resolves intent, powers personalization')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('events', 'Event ingestion')
    .addTag('intent', 'Intent scores')
    .addTag('users', 'User profiles')
    .addTag('segments', 'Audience segments')
    .addTag('analytics', 'Analytics queries')
    .addTag('health', 'Health checks')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? SERVICE_PORTS.API_GATEWAY;
  await app.listen(port);
  console.log(`🚀 API Gateway running on http://localhost:${port}`);
  console.log(`📖 Swagger docs at http://localhost:${port}/docs`);
}

bootstrap();
