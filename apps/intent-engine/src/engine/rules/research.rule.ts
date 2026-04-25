import { TrackingEvent } from '@intent/common-types';
import { IntentRule, RuleResult } from './intent-rule.interface';

/**
 * Research intent: user is gathering information
 *  Many page views + searches but no add_to_cart
 */
export class ResearchIntentRule implements IntentRule {
  evaluate(events: TrackingEvent[]): RuleResult {
    const pageViews  = events.filter(e => e.eventType === 'page_view').length;
    const searches   = events.filter(e => e.eventType === 'search').length;
    const addToCart  = events.filter(e => e.eventType === 'add_to_cart').length;
    const scrolls    = events.filter(e => e.eventType === 'scroll_depth').length;

    // Research is high searches + page views, low purchase actions
    if (addToCart > 0) {
      return { intentType: 'research', score: 0, confidence: 0, signals: [] };
    }

    let score = 0;
    const signals = [];

    if (searches > 2) {
      score += Math.min(searches, 5) * 10;
      signals.push({ name: 'search_count', value: searches, weight: 10 });
    }

    if (pageViews > 3) {
      score += Math.min(pageViews, 10) * 5;
      signals.push({ name: 'page_view_count', value: pageViews, weight: 5 });
    }

    if (scrolls > 2) {
      score += 10;
      signals.push({ name: 'deep_scroll', value: scrolls, weight: 10 });
    }

    return {
      intentType: 'research',
      score: Math.min(score, 100),
      confidence: score > 40 ? 0.70 : 0.40,
      signals,
    };
  }
}
