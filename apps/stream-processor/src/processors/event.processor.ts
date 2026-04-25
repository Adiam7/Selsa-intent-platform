import { Injectable, Logger, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import Redis from 'ioredis';
import { KAFKA_TOPICS, REDIS_KEYS, REDIS_CLIENT, TTL } from '@intent/constants';
import { TrackingEvent } from '@intent/common-types';
import { KafkaProducerService } from '../kafka/kafka-producer.service';

@Injectable()
export class EventProcessor implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EventProcessor.name);
  private consumer!: Consumer;

  constructor(
    private readonly config: ConfigService,
    private readonly kafkaProducer: KafkaProducerService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  async onModuleInit() {
    const kafka = new Kafka({
      clientId: this.config.get<string>('KAFKA_CLIENT_ID', 'stream-processor'),
      brokers: this.config.get<string>('KAFKA_BROKERS', 'localhost:9092').split(','),
    });

    this.consumer = kafka.consumer({
      groupId: this.config.get<string>('KAFKA_GROUP_ID', 'stream-processor-group'),
    });

    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: KAFKA_TOPICS.RAW_EVENTS,
      fromBeginning: false,
    });

    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        await this.handleMessage(payload);
      },
    });

    this.logger.log(`📨 Consuming from topic: ${KAFKA_TOPICS.RAW_EVENTS}`);
  }

  async onModuleDestroy() {
    await this.consumer?.disconnect();
  }

  private async handleMessage({ topic, partition, message }: EachMessagePayload) {
    if (!message.value) return;

    let event: TrackingEvent;
    try {
      event = JSON.parse(message.value.toString()) as TrackingEvent;
    } catch {
      this.logger.warn(`[partition=${partition}] Malformed message — skipping`);
      return;
    }

    this.logger.debug(
      `[${topic}][${partition}] Processing ${event.eventType} for user ${event.userId}`,
    );

    // ── Pipeline steps ──────────────────────────────────────────────────────
    const enriched = this.enrich(event);
    await this.updateRecentEventsCache(enriched);
    await this.triggerIntentRecompute(enriched);
    // ────────────────────────────────────────────────────────────────────────
  }

  /** Attach derived fields (e.g., device type from UA) */
  private enrich(event: TrackingEvent): TrackingEvent {
    return {
      ...event,
      metadata: {
        ...event.metadata,
        _processed: true,
        _processedAt: new Date().toISOString(),
      },
    };
  }

  /** Push event into the per-user sliding window in Redis */
  private async updateRecentEventsCache(event: TrackingEvent): Promise<void> {
    const key = REDIS_KEYS.userRecentEvents(event.userId);
    const score = new Date(event.timestamp).getTime();
    const value = JSON.stringify(event);

    try {
      // Add event to sorted set with timestamp as score
      await this.redis.zadd(key, score, value);

      // Trim to keep only the 100 most recent events
      await this.redis.zremrangebyrank(key, 0, -101);

      // Set expiry (24 hours)
      await this.redis.expire(key, TTL.RECENT_EVENTS);

      this.logger.debug(`[cache] updated for userId=${event.userId}`);
    } catch (err) {
      this.logger.error(`[cache] Failed to update for ${event.userId}: ${err}`);
    }
  }

  /** Publish to intent-updates topic so intent-engine can recompute */
  private async triggerIntentRecompute(event: TrackingEvent): Promise<void> {
    try {
      await this.kafkaProducer.sendMessage(KAFKA_TOPICS.INTENT_UPDATES, [
        {
          ...event,
          key: event.userId, // Partition by userId for ordering guarantees
        },
      ]);

      this.logger.debug(`[intent] triggered recompute for userId=${event.userId}`);
    } catch (err) {
      this.logger.error(`[intent] Failed to trigger recompute: ${err}`);
    }
  }
}

