import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SERVICE_PORTS } from '@intent/constants';

async function bootstrap() {
  // Stream processor runs as a Kafka consumer — no HTTP server needed.
  // A minimal HTTP port is kept alive for health probes in k8s.
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? SERVICE_PORTS.STREAM_PROCESSOR;
  await app.listen(port);
  console.log(`🔄 Stream Processor running (health on :${port})`);
}

bootstrap();
