-- ClickHouse analytics schema
-- Run automatically via docker-entrypoint-initdb.d

CREATE DATABASE IF NOT EXISTS intent_analytics;

USE intent_analytics;

-- ── Raw events (immutable, high-volume) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS events
(
  id          String,
  user_id     String,
  session_id  String,
  event_type  LowCardinality(String),
  metadata    String,     -- JSON stored as string
  url         String,
  referrer    String,
  ip          String,
  user_agent  String,
  timestamp   DateTime64(3, 'UTC'),
  -- Derived
  date        Date        MATERIALIZED toDate(timestamp)
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (user_id, timestamp)
TTL timestamp + INTERVAL 2 YEAR DELETE
SETTINGS index_granularity = 8192;

-- ── Intent score history ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS intent_score_history
(
  user_id     String,
  score       UInt8,
  intent_type LowCardinality(String),
  confidence  Float32,
  recorded_at DateTime64(3, 'UTC'),
  date        Date MATERIALIZED toDate(recorded_at)
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(recorded_at)
ORDER BY (user_id, recorded_at)
TTL recorded_at + INTERVAL 1 YEAR DELETE;

-- ── Materialized view: daily event counts per user ───────────────────────────
CREATE MATERIALIZED VIEW IF NOT EXISTS daily_event_counts
ENGINE = SummingMergeTree()
PARTITION BY toYYYYMM(date)
ORDER BY (date, user_id, event_type)
AS
SELECT
  toDate(timestamp)           AS date,
  user_id,
  event_type,
  count()                     AS event_count
FROM events
GROUP BY date, user_id, event_type;
