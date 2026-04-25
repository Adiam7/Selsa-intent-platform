/**
 * @intent/sdk-node
 * Server-side Node.js tracking SDK — use for backend-generated events
 * (purchases confirmed, subscription events, webhooks, etc.)
 *
 * Usage:
 *   import { IntentNodeSDK } from '@intent/sdk-node';
 *   const sdk = new IntentNodeSDK({ writeKey: process.env.INTENT_WRITE_KEY });
 *   await sdk.track('purchase', { userId: 'uuid', metadata: { orderId: '...' } });
 *   await sdk.flush(); // call on graceful shutdown
 */

import { request } from 'undici';
import { randomUUID } from 'crypto';

export type EventType =
  | 'page_view' | 'click' | 'add_to_cart' | 'remove_from_cart'
  | 'purchase' | 'search' | 'scroll_depth' | 'session_start'
  | 'session_end' | 'form_submit' | 'custom';

export interface NodeSDKOptions {
  writeKey: string;
  endpoint?: string;
  flushAt?: number;
  flushInterval?: number;
  maxRetries?: number;
  debug?: boolean;
}

export interface ServerEvent {
  userId: string;
  sessionId?: string;
  eventType: EventType;
  metadata?: Record<string, unknown>;
  timestamp?: string;
}

interface QueuedEvent extends Required<ServerEvent> {
  writeKey: string;
}

export class IntentNodeSDK {
  private readonly opts: Required<NodeSDKOptions>;
  private readonly queue: QueuedEvent[] = [];
  private flushTimer?: NodeJS.Timeout;

  constructor(options: NodeSDKOptions) {
    this.opts = {
      endpoint: 'https://api.intent.example.com',
      flushAt: 50,
      flushInterval: 5000,
      maxRetries: 3,
      debug: false,
      ...options,
    };

    this.flushTimer = setInterval(() => void this.flush(), this.opts.flushInterval);
  }

  /** Track a server-side event */
  track(eventType: EventType, event: Omit<ServerEvent, 'eventType'>): this {
    const queued: QueuedEvent = {
      userId: event.userId,
      sessionId: event.sessionId ?? randomUUID(),
      eventType,
      metadata: event.metadata ?? {},
      timestamp: event.timestamp ?? new Date().toISOString(),
      writeKey: this.opts.writeKey,
    };

    this.queue.push(queued);
    this.log(`queued ${eventType} for ${event.userId}`);

    if (this.queue.length >= this.opts.flushAt) {
      void this.flush();
    }

    return this;
  }

  /** Flush all queued events. Call on graceful shutdown. */
  async flush(): Promise<void> {
    if (this.queue.length === 0) return;

    const batch = this.queue.splice(0, this.queue.length);
    const url = `${this.opts.endpoint}/v1/events/batch`;

    for (let attempt = 1; attempt <= this.opts.maxRetries; attempt++) {
      try {
        const { statusCode } = await request(url, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'user-agent': `@intent/sdk-node/0.1.0`,
          },
          body: JSON.stringify({
            events: batch,
            writeKey: this.opts.writeKey,
          }),
        });

        if (statusCode >= 200 && statusCode < 300) {
          this.log(`flushed ${batch.length} events`);
          return;
        }

        this.log(`flush attempt ${attempt} returned ${statusCode}`);
      } catch (err) {
        this.log(`flush attempt ${attempt} failed:`, err);
      }

      if (attempt < this.opts.maxRetries) {
        await sleep(Math.pow(2, attempt) * 200);
      }
    }

    // Give up — re-queue to avoid silent data loss in dev
    if (this.opts.debug) this.queue.unshift(...batch);
  }

  /** Graceful shutdown — flush remaining events and stop the timer */
  async shutdown(): Promise<void> {
    clearInterval(this.flushTimer);
    await this.flush();
  }

  private log(msg: string, ...args: unknown[]) {
    if (this.opts.debug) {
      console.debug(`[IntentNodeSDK] ${msg}`, ...args);
    }
  }
}

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));
