import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EventProcessor } from './event.processor';
import { RedisModule } from '../redis/redis.module';
import { KafkaProducerService } from '../kafka/kafka-producer.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_CLIENT',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: config.get<string>('KAFKA_CLIENT_ID', 'stream-processor'),
              brokers: config.get<string>('KAFKA_BROKERS', 'localhost:9092').split(','),
            },
            consumer: {
              groupId: config.get<string>('KAFKA_GROUP_ID', 'stream-processor-group'),
            },
          },
        }),
      },
    ]),
    RedisModule,
  ],
  providers: [EventProcessor, KafkaProducerService],
})
export class ProcessorModule {}
