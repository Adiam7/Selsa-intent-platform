import { Injectable, Logger, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_KEYS, REDIS_CLIENT } from '@intent/constants';
import { TrackingEvent } from '@intent/common-types';

@Injectable()
export class EventCacheService {
  private readonly logger = new Logger(EventCacheService.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  /**
   * Fetch recent events (up to 100) for a user from the sorted set.
   * Events are stored as JSON strings scored by timestamp.
   */
  async getRecentEvents(userId: string): Promise<TrackingEvent[]> {
    const key = REDIS_KEYS.userRecentEvents(userId);

    try {
      // Get all events (sorted by score/timestamp, newest last)
      const rawEvents = await this.redis.zrange(key, 0, -1);

      if (rawEvents.length === 0) {
        return [];
      }

      const events: TrackingEvent[] = [];
      for (const raw of rawEvents) {
        try {
          const event = JSON.parse(raw) as TrackingEvent;
          events.push(event);
        } catch {
          this.logger.warn(`[eventCache] Malformed event for ${userId} — skipping`);
        }
      }

      return events;
    } catch (err) {
      this.logger.error(`[eventCache] Failed to fetch recent events for ${userId}: ${err}`);
      return [];
    }
  }

  /**
   * Add an event to the user's recent events sorted set.
   * Keeps only the 100 most recent by trimming older entries.
   */
  async addEvent(event: TrackingEvent): Promise<void> {
    const key = REDIS_KEYS.userRecentEvents(event.userId);
    const score = new Date(event.timestamp).getTime();
    const value = JSON.stringify(event);

    try {
      // Add event to sorted set with timestamp as score
      await this.redis.zadd(key, score, value);

      // Trim to keep only the 100 most recent events
      await this.redis.zremrangebyrank(key, 0, -101);

      // Set expiry (24 hours)
      await this.redis.expire(key, 86400);
    } catch (err) {
      this.logger.error(
        `[eventCache] Failed to add event for ${event.userId}: ${err}`,
      );
    }
  }
}
