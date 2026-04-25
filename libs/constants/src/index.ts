// ─── Kafka Topics ─────────────────────────────────────────────────────────────

export const KAFKA_TOPICS = {
  RAW_EVENTS: 'raw-events',
  PROCESSED_EVENTS: 'processed-events',
  INTENT_UPDATES: 'intent-updates',
  SEGMENT_UPDATES: 'segment-updates',
  SESSION_EVENTS: 'session-events',
} as const;

export type KafkaTopic = (typeof KAFKA_TOPICS)[keyof typeof KAFKA_TOPICS];

// ─── Redis Key Factories ──────────────────────────────────────────────────────

export const REDIS_KEYS = {
  session: (id: string) => `session:${id}`,
  intentScore: (userId: string) => `intent:${userId}`,
  userRecentEvents: (userId: string) => `events:recent:${userId}`,
  rateLimit: (key: string) => `rate:${key}`,
  segmentMembership: (userId: string) => `segments:${userId}`,
  userProfile: (userId: string) => `profile:${userId}`,
  analyticsCache: (key: string) => `analytics:${key}`,
} as const;

// ─── TTLs (seconds) ───────────────────────────────────────────────────────────

export const TTL = {
  INTENT_SCORE: 60 * 60 * 24,        // 24 hours
  SESSION: 60 * 30,                   // 30 minutes
  USER_PROFILE: 60 * 60,             // 1 hour
  ANALYTICS_CACHE: 60 * 5,           // 5 minutes
  RECENT_EVENTS: 60 * 60,            // 1 hour
} as const;

// ─── Intent Scoring ───────────────────────────────────────────────────────────

export const INTENT_SCORE = {
  MAX: 100,
  MIN: 0,
  THRESHOLDS: {
    HIGH: 70,
    MEDIUM: 40,
    LOW: 10,
  },
} as const;

// ─── Pagination ───────────────────────────────────────────────────────────────

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// ─── Service Ports ────────────────────────────────────────────────────────────

export const SERVICE_PORTS = {
  DASHBOARD: 3000,
  API_GATEWAY: 3001,
  EVENT_COLLECTOR: 3002,
  INTENT_ENGINE: 3003,
  STREAM_PROCESSOR: 3004,
  WORKER_JOBS: 3005,
  AUTH_SERVICE: 3010,
  USER_SERVICE: 3011,
  SEGMENTATION_SERVICE: 3012,
  ANALYTICS_SERVICE: 3013,
  RECOMMENDATION_SERVICE: 3014,
  CONTENT_SERVICE: 3015,
} as const;

// ─── Events ───────────────────────────────────────────────────────────────────

export const MAX_BATCH_EVENTS = 100;
export const EVENTS_WINDOW_SECONDS = 60 * 60; // 1-hour sliding window for intent scoring

// ─── Injection Tokens ─────────────────────────────────────────────────────────

export const KAFKA_PRODUCER = 'KAFKA_PRODUCER';
export const REDIS_CLIENT = 'REDIS_CLIENT';

// ─── Consumer Intent Types ────────────────────────────────────────────────────

export const CONSUMER_INTENT_TYPES = [
  'build_something',
  'learn_something',
  'teach_something',
  'get_help',
  'give_support',
  'find_collaborators',
  'do_collaboration',
  'sell_something',
  'buy_something',
  'explore_ideas',
] as const;

export type ConsumerIntentType = (typeof CONSUMER_INTENT_TYPES)[number];

