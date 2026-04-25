import { z } from 'zod';

// ─── Event Type ───────────────────────────────────────────────────────────────

export const EventTypeSchema = z.enum([
  'page_view',
  'click',
  'add_to_cart',
  'remove_from_cart',
  'purchase',
  'search',
  'scroll_depth',
  'session_start',
  'session_end',
  'form_submit',
  'video_play',
  'hover',
  'custom',
]);

// ─── Track Event ──────────────────────────────────────────────────────────────

export const TrackEventSchema = z.object({
  userId: z.string().uuid({ message: 'userId must be a valid UUID' }),
  sessionId: z.string().uuid({ message: 'sessionId must be a valid UUID' }),
  eventType: EventTypeSchema,
  metadata: z.record(z.unknown()).default({}),
  timestamp: z.string().datetime().optional(),
  url: z.string().url().optional(),
  referrer: z.string().url().optional(),
});

export type TrackEventInput = z.infer<typeof TrackEventSchema>;

// ─── Batch Events ─────────────────────────────────────────────────────────────

export const BatchTrackEventSchema = z.object({
  events: z
    .array(TrackEventSchema)
    .min(1, 'At least one event required')
    .max(100, 'Maximum 100 events per batch'),
  writeKey: z.string().min(1),
});

export type BatchTrackEventInput = z.infer<typeof BatchTrackEventSchema>;

// ─── Segment Rules ────────────────────────────────────────────────────────────

export const SegmentRuleSchema = z.object({
  field: z.string().min(1),
  operator: z.enum([
    'eq', 'neq',
    'gt', 'lt', 'gte', 'lte',
    'contains', 'not_contains',
    'in', 'not_in',
  ]),
  value: z.unknown(),
});

export const CreateSegmentSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  rules: z.array(SegmentRuleSchema).min(1),
  operator: z.enum(['AND', 'OR']).default('AND'),
});

export type CreateSegmentInput = z.infer<typeof CreateSegmentSchema>;

// ─── Intent Query ─────────────────────────────────────────────────────────────

export const GetIntentSchema = z.object({
  userId: z.string().uuid(),
});

export type GetIntentInput = z.infer<typeof GetIntentSchema>;

// ─── Analytics Query ──────────────────────────────────────────────────────────

export const AnalyticsQuerySchema = z.object({
  userId: z.string().uuid().optional(),
  segmentId: z.string().uuid().optional(),
  eventType: EventTypeSchema.optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  groupBy: z.enum(['day', 'week', 'month', 'hour']).default('day'),
});

export type AnalyticsQueryInput = z.infer<typeof AnalyticsQuerySchema>;
