import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { SERVICE_PORTS } from '@intent/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );

  const port = process.env.PORT ?? SERVICE_PORTS.EVENT_COLLECTOR;
  await app.listen(port);
  console.log(`📡 Event Collector running on http://localhost:${port}`);
}

bootstrap();
