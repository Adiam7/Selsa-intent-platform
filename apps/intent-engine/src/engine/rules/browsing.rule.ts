import { TrackingEvent } from '@intent/common-types';
import { IntentRule, RuleResult } from './intent-rule.interface';

/** Low-engagement browsing — default fallback */
export class BrowsingIntentRule implements IntentRule {
  evaluate(events: TrackingEvent[]): RuleResult {
    const pageViews = events.filter(e => e.eventType === 'page_view').length;

    const score = Math.min(pageViews * 5, 30);
    const signals = pageViews > 0
      ? [{ name: 'page_view_count', value: pageViews, weight: 5 }]
      : [];

    return {
      intentType: 'browsing',
      score,
      confidence: 0.40,
      signals,
    };
  }
}
