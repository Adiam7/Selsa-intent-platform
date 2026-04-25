import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaProducerService.name);
  private producer!: Producer;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    const kafka = new Kafka({
      clientId: this.config.get<string>('KAFKA_CLIENT_ID', 'stream-processor'),
      brokers: this.config.get<string>('KAFKA_BROKERS', 'localhost:9092').split(','),
    });

    this.producer = kafka.producer();
    await this.producer.connect();
    this.logger.log('Kafka producer connected');
  }

  async onModuleDestroy() {
    await this.producer?.disconnect();
  }

  /**
   * Send a message to a Kafka topic
   */
  async sendMessage(topic: string, messages: any[]): Promise<void> {
    try {
      const result = await this.producer.send({
        topic,
        messages: messages.map((msg) => ({
          value: JSON.stringify(msg),
          key: msg.key || null,
        })),
      });

      this.logger.debug(
        `✓ Published ${messages.length} message(s) to ${topic}`,
      );
    } catch (err) {
      this.logger.error(`Failed to publish to ${topic}: ${err}`);
      throw err;
    }
  }
}
