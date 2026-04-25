import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SERVICE_PORTS } from '@intent/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? SERVICE_PORTS.RECOMMENDATION_SERVICE;
  await app.listen(port);
  console.log(`💡 Recommendation Service running on http://localhost:${port}`);
}
bootstrap();
