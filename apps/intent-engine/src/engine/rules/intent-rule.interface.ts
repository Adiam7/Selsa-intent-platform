import { TrackingEvent, IntentType, IntentSignal } from '@intent/common-types';

export interface RuleResult {
  intentType: IntentType;
  score: number;
  confidence: number;
  signals: IntentSignal[];
}

export interface IntentRule {
  evaluate(events: TrackingEvent[]): RuleResult;
}
