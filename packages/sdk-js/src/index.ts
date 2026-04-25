/**
 * @intent/sdk-js
 * Browser tracking SDK — lightweight, zero-dependency, ~2 KB gzipped.
 *
 * Usage:
 *   import { IntentSDK } from '@intent/sdk-js';
 *   const sdk = new IntentSDK({ writeKey: 'YOUR_WRITE_KEY' });
 *   sdk.identify('user-uuid');
 *   sdk.track('add_to_cart', { productId: '123', price: 49.99 });
 */

export type EventType =
  | 'page_view' | 'click' | 'add_to_cart' | 'remove_from_cart'
  | 'purchase' | 'search' | 'scroll_depth' | 'session_start'
  | 'session_end' | 'form_submit' | 'video_play' | 'hover' | 'custom';

export interface SDKOptions {
  /** Your project write key (from dashboard → Settings) */
  writeKey: string;
  /** API endpoint — defaults to https://api.intent.example.com */
  endpoint?: string;
  /** Automatically track page_view on load and history changes */
  autoPageView?: boolean;
  /** Max events queued before flushing (default 20) */
  flushAt?: number;
  /** Flush interval in ms (default 2000) */
  flushInterval?: number;
  /** Attach debug logs to console */
  debug?: boolean;
}

export interface TrackPayload {
  userId?: string;
  anonymousId: string;
  sessionId: string;
  eventType: EventType;
  metadata: Record<string, unknown>;
  timestamp: string;
  url: string;
  referrer: string;
  writeKey: string;
}

const SESSION_KEY = '__intent_sid';
const ANON_KEY    = '__intent_aid';

function getOrCreate(key: string): string {
  let val = localStorage.getItem(key);
  if (!val) {
    val = crypto.randomUUID();
    localStorage.setItem(key, val);
  }
  return val;
}

export class IntentSDK {
  private readonly options: Required<SDKOptions>;
  private userId?: string;
  private readonly queue: TrackPayload[] = [];
  private flushTimer?: ReturnType<typeof setInterval>;

  private readonly anonymousId: string;
  private readonly sessionId: string;

  constructor(options: SDKOptions) {
    this.options = {
      endpoint: 'https://api.intent.example.com',
      autoPageView: true,
      flushAt: 20,
      flushInterval: 2000,
      debug: false,
      ...options,
    };

    this.anonymousId = getOrCreate(ANON_KEY);
    this.sessionId   = getOrCreate(SESSION_KEY);

    this.flushTimer = setInterval(() => void this.flush(), this.options.flushInterval);

    if (this.options.autoPageView) {
      this.track('page_view');
      // SPA history changes
      const original = window.history.pushState.bind(window.history);
      window.history.pushState = (...args) => {
        original(...args);
        this.track('page_view');
      };
    }

    // Flush on unload
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') void this.flush();
    });
  }

  /** Associate future events with a known user ID */
  identify(userId: string) {
    this.userId = userId;
    this.log(`identify → ${userId}`);
  }

  /** Track a user event */
  track(eventType: EventType, metadata: Record<string, unknown> = {}) {
    const payload: TrackPayload = {
      userId: this.userId,
      anonymousId: this.anonymousId,
      sessionId: this.sessionId,
      eventType,
      metadata,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      referrer: document.referrer,
      writeKey: this.options.writeKey,
    };

    this.queue.push(payload);
    this.log(`queued ${eventType}`, metadata);

    if (this.queue.length >= this.options.flushAt) {
      void this.flush();
    }
  }

  /** Flush queued events to the API */
  async flush(): Promise<void> {
    if (this.queue.length === 0) return;

    const batch = this.queue.splice(0, this.queue.length);
    const url = `${this.options.endpoint}/v1/events/batch`;

    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: batch, writeKey: this.options.writeKey }),
        // Use keepalive so flush on unload succeeds
        keepalive: true,
      });
      this.log(`flushed ${batch.length} events`);
    } catch (err) {
      // Re-queue on network failure
      this.queue.unshift(...batch);
      this.log('flush failed, re-queued', err);
    }
  }

  /** Tear down the SDK (clear timers) */
  destroy() {
    clearInterval(this.flushTimer);
  }

  private log(msg: string, ...args: unknown[]) {
    if (this.options.debug) {
      console.debug(`[IntentSDK] ${msg}`, ...args);
    }
  }
}

// ── CDN / script-tag usage  ───────────────────────────────────────────────────
// <script>
//   window.intentQ = window.intentQ || [];
//   window.intentQ.push(['init', { writeKey: 'xxx' }]);
//   window.intentQ.push(['identify', 'user-uuid']);
//   window.intentQ.push(['track', 'add_to_cart', { productId: '123' }]);
// </script>
if (typeof window !== 'undefined') {
  const q: [string, ...unknown[]][] = (window as unknown as { intentQ?: [string, ...unknown[]][] }).intentQ ?? [];
  let sdk: IntentSDK | null = null;

  const flush = () => {
    (window as unknown as { intentQ: { push: (...args: unknown[]) => void } }).intentQ = {
      push: (...args: unknown[]) => execute(args as [string, ...unknown[]]),
    };
  };

  const execute = (cmd: [string, ...unknown[]]) => {
    const [method, ...args] = cmd;
    if (method === 'init' && !sdk) {
      sdk = new IntentSDK(args[0] as SDKOptions);
      flush();
    } else if (sdk) {
      (sdk as unknown as Record<string, (...a: unknown[]) => void>)[method]?.(...args);
    }
  };

  q.forEach(execute);
}
