import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SERVICE_PORTS } from '@intent/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = process.env.PORT ?? SERVICE_PORTS.INTENT_ENGINE;
  await app.listen(port);
  console.log(`🧠 Intent Engine running on http://localhost:${port}`);
}

bootstrap();
