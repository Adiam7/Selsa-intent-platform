import { Injectable, Inject, Logger } from '@nestjs/common';
import { Producer } from 'kafkajs';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import {
  KAFKA_PRODUCER,
  KAFKA_TOPICS,
  REDIS_KEYS,
  TTL,
} from '@intent/constants';
import { TrackEventInput } from '@intent/event-schemas';
import { sanitizeIp, parseUserAgent } from '@intent/utils';

// Resolves to the REDIS_CLIENT injection token from RedisModule
const REDIS_CLIENT_TOKEN = 'REDIS_CLIENT';

@Injectable()
export class CollectorService {
  private readonly logger = new Logger(CollectorService.name);

  constructor(
    @Inject(KAFKA_PRODUCER) private readonly producer: Producer,
    @Inject(REDIS_CLIENT_TOKEN) private readonly redis: Redis,
  ) {}

  async track(
    dto: TrackEventInput & { ip?: string; userAgent?: string },
  ): Promise<void> {
    const uaInfo = parseUserAgent(dto.userAgent);

    // Drop events from known bots
    if (uaInfo.isBot) {
      this.logger.debug(`Dropping bot event from UA: ${dto.userAgent}`);
      return;
    }

    const event = {
      ...dto,
      id: uuidv4(),
      ip: sanitizeIp(dto.ip),
      timestamp: dto.timestamp ?? new Date().toISOString(),
    };

    // Push to Kafka — key by userId for ordered per-user processing
    await this.producer.send({
      topic: KAFKA_TOPICS.RAW_EVENTS,
      messages: [
        {
          key: event.userId,
          value: JSON.stringify(event),
          headers: { source: 'event-collector' },
        },
      ],
    });

    // Update session activity in Redis
    const sessionKey = REDIS_KEYS.session(event.sessionId);
    await this.redis
      .multi()
      .hincrby(sessionKey, 'eventCount', 1)
      .hset(sessionKey, 'lastActivityAt', event.timestamp)
      .expire(sessionKey, TTL.SESSION)
      .exec();

    this.logger.debug(`Tracked ${event.eventType} for user ${event.userId}`);
  }

  async trackBatch(
    events: TrackEventInput[],
    context: { ip?: string; userAgent?: string },
  ): Promise<void> {
    const uaInfo = parseUserAgent(context.userAgent);
    if (uaInfo.isBot) return;

    const enriched = events.map(e => ({
      ...e,
      ...context,
      id: uuidv4(),
      ip: sanitizeIp(context.ip),
      timestamp: e.timestamp ?? new Date().toISOString(),
    }));

    await this.producer.sendBatch({
      topicMessages: [
        {
          topic: KAFKA_TOPICS.RAW_EVENTS,
          messages: enriched.map(e => ({
            key: e.userId,
            value: JSON.stringify(e),
            headers: { source: 'event-collector-batch' },
          })),
        },
      ],
    });

    this.logger.debug(`Batch tracked ${enriched.length} events`);
  }
}


