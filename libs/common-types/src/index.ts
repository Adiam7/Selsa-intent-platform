// ─── User ──────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, unknown>;
}

// ─── Events ───────────────────────────────────────────────────────────────────

export type EventType =
  | 'page_view'
  | 'click'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'purchase'
  | 'search'
  | 'scroll_depth'
  | 'session_start'
  | 'session_end'
  | 'form_submit'
  | 'video_play'
  | 'hover'
  | 'custom';

export interface TrackingEvent {
  id: string;
  userId: string;
  sessionId: string;
  eventType: EventType;
  metadata: Record<string, unknown>;
  timestamp: Date;
  ip?: string;
  userAgent?: string;
  url?: string;
  referrer?: string;
}

// ─── Sessions ─────────────────────────────────────────────────────────────────

export interface Session {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  pageViews: number;
  eventCount: number;
  lastActivityAt: Date;
}

// ─── Intent ───────────────────────────────────────────────────────────────────

export type IntentType =
  | 'buying'
  | 'high_purchase'
  | 'research'
  | 'comparison'
  | 'churn_risk'
  | 'engagement_boost'
  | 'browsing'
  | 'unknown';

export interface IntentSignal {
  name: string;
  value: number;
  weight: number;
}

export interface IntentScore {
  userId: string;
  score: number;        // 0–100
  intentType: IntentType;
  confidence: number;   // 0–1
  signals: IntentSignal[];
  updatedAt: Date;
}

// ─── Segments ─────────────────────────────────────────────────────────────────

export type RuleOperator =
  | 'eq' | 'neq'
  | 'gt' | 'lt' | 'gte' | 'lte'
  | 'contains' | 'not_contains'
  | 'in' | 'not_in';

export interface SegmentRule {
  field: string;
  operator: RuleOperator;
  value: unknown;
}

export interface Segment {
  id: string;
  name: string;
  description?: string;
  rules: SegmentRule[];
  operator: 'AND' | 'OR';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSegment {
  userId: string;
  segmentId: string;
  joinedAt: Date;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
  errors?: { field: string; message: string }[];
  timestamp: string;
  path: string;
}

// ─── Recommendations ──────────────────────────────────────────────────────────

export interface Recommendation {
  id: string;
  userId: string;
  itemId: string;
  itemType: string;
  score: number;
  reason: string;
  createdAt: Date;
}
