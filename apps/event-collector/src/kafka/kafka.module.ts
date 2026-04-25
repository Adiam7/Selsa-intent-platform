import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer } from 'kafkajs';
import { KAFKA_PRODUCER } from '@intent/constants';

@Global()
@Module({
  providers: [
    {
      provide: KAFKA_PRODUCER,
      inject: [ConfigService],
      useFactory: async (config: ConfigService): Promise<Producer> => {
        const kafka = new Kafka({
          clientId: config.get<string>('KAFKA_CLIENT_ID', 'event-collector'),
          brokers: config.get<string>('KAFKA_BROKERS', 'localhost:9092').split(','),
          retry: { retries: 5 },
        });
        const producer = kafka.producer({
          allowAutoTopicCreation: false,
          idempotent: true,
        });
        await producer.connect();
        return producer;
      },
    },
  ],
  exports: [KAFKA_PRODUCER],
})
export class KafkaModule {}
