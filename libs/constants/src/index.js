"use strict";
// ─── Kafka Topics ─────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONSUMER_INTENT_TYPES = exports.REDIS_CLIENT = exports.KAFKA_PRODUCER = exports.EVENTS_WINDOW_SECONDS = exports.MAX_BATCH_EVENTS = exports.SERVICE_PORTS = exports.PAGINATION = exports.INTENT_SCORE = exports.TTL = exports.REDIS_KEYS = exports.KAFKA_TOPICS = void 0;
exports.KAFKA_TOPICS = {
    RAW_EVENTS: 'raw-events',
    PROCESSED_EVENTS: 'processed-events',
    INTENT_UPDATES: 'intent-updates',
    SEGMENT_UPDATES: 'segment-updates',
    SESSION_EVENTS: 'session-events',
};
// ─── Redis Key Factories ──────────────────────────────────────────────────────
exports.REDIS_KEYS = {
    session: (id) => `session:${id}`,
    intentScore: (userId) => `intent:${userId}`,
    userRecentEvents: (userId) => `events:recent:${userId}`,
    rateLimit: (key) => `rate:${key}`,
    segmentMembership: (userId) => `segments:${userId}`,
    userProfile: (userId) => `profile:${userId}`,
    analyticsCache: (key) => `analytics:${key}`,
};
// ─── TTLs (seconds) ───────────────────────────────────────────────────────────
exports.TTL = {
    INTENT_SCORE: 60 * 60 * 24, // 24 hours
    SESSION: 60 * 30, // 30 minutes
    USER_PROFILE: 60 * 60, // 1 hour
    ANALYTICS_CACHE: 60 * 5, // 5 minutes
    RECENT_EVENTS: 60 * 60, // 1 hour
};
// ─── Intent Scoring ───────────────────────────────────────────────────────────
exports.INTENT_SCORE = {
    MAX: 100,
    MIN: 0,
    THRESHOLDS: {
        HIGH: 70,
        MEDIUM: 40,
        LOW: 10,
    },
};
// ─── Pagination ───────────────────────────────────────────────────────────────
exports.PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
};
// ─── Service Ports ────────────────────────────────────────────────────────────
exports.SERVICE_PORTS = {
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
};
// ─── Events ───────────────────────────────────────────────────────────────────
exports.MAX_BATCH_EVENTS = 100;
exports.EVENTS_WINDOW_SECONDS = 60 * 60; // 1-hour sliding window for intent scoring
// ─── Injection Tokens ─────────────────────────────────────────────────────────
exports.KAFKA_PRODUCER = 'KAFKA_PRODUCER';
exports.REDIS_CLIENT = 'REDIS_CLIENT';
// ─── Consumer Intent Types ────────────────────────────────────────────────────
exports.CONSUMER_INTENT_TYPES = [
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
];
//# sourceMappingURL=index.js.map