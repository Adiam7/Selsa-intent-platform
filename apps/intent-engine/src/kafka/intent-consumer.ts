import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { KAFKA_TOPICS } from '@intent/constants';
import { TrackingEvent } from '@intent/common-types';
import { IntentService } from '../engine/intent.service';
import { EventCacheService } from './event-cache.service';

@Injectable()
export class IntentConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(IntentConsumer.name);
  private consumer!: Consumer;

  constructor(
    private readonly config: ConfigService,
    private readonly intentService: IntentService,
    private readonly eventCache: EventCacheService,
  ) {}

  async onModuleInit() {
    const kafka = new Kafka({
      clientId: this.config.get<string>('KAFKA_CLIENT_ID', 'intent-engine'),
      brokers: this.config.get<string>('KAFKA_BROKERS', 'localhost:9092').split(','),
    });

    this.consumer = kafka.consumer({
      groupId: this.config.get<string>('KAFKA_GROUP_ID', 'intent-engine-group'),
    });

    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: KAFKA_TOPICS.INTENT_UPDATES,
      fromBeginning: false,
    });

    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        await this.handleMessage(payload);
      },
    });

    this.logger.log(`🧠 Consuming intent-updates from Kafka`);
  }

  async onModuleDestroy() {
    await this.consumer?.disconnect();
  }

  private async handleMessage({ topic, partition, message }: EachMessagePayload) {
    if (!message.value) return;

    let event: TrackingEvent;
    try {
      event = JSON.parse(message.value.toString()) as TrackingEvent;
    } catch (err) {
      this.logger.warn(`[partition=${partition}] Malformed message — skipping`);
      return;
    }

    try {
      this.logger.debug(
        `[${topic}][${partition}] Recomputing intent for user ${event.userId}`,
      );

      // Fetch recent events for this user
      const recentEvents = await this.eventCache.getRecentEvents(event.userId);

      // Compute and store intent score
      const intentScore = await this.intentService.computeAndStore(
        event.userId,
        recentEvents,
      );

      this.logger.debug(
        `✓ Intent computed for ${event.userId} → ${intentScore.intentType} (${intentScore.score})`,
      );
    } catch (err) {
      this.logger.error(
        `Failed to process intent update for user ${event.userId}: ${err}`,
      );
    }
  }
}
