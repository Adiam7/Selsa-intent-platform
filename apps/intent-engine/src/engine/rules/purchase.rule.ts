import { TrackingEvent } from '@intent/common-types';
import { IntentRule, RuleResult } from './intent-rule.interface';

/**
 * Signals:
 *  add_to_cart events   → +25 pts each (max 3)
 *  purchase events      → +50 pts
 *  search events        → +10 pts
 *  ≥5 page views        → +10 pts
 */
export class PurchaseIntentRule implements IntentRule {
  evaluate(events: TrackingEvent[]): RuleResult {
    const addToCartCount = events.filter(e => e.eventType === 'add_to_cart').length;
    const purchaseCount  = events.filter(e => e.eventType === 'purchase').length;
    const searchCount    = events.filter(e => e.eventType === 'search').length;
    const pageViewCount  = events.filter(e => e.eventType === 'page_view').length;

    let score = 0;
    const signals = [];

    if (addToCartCount > 0) {
      const pts = Math.min(addToCartCount, 3) * 25;
      score += pts;
      signals.push({ name: 'add_to_cart', value: addToCartCount, weight: 25 });
    }

    if (purchaseCount > 0) {
      score += 50;
      signals.push({ name: 'purchase', value: purchaseCount, weight: 50 });
    }

    if (searchCount > 0) {
      const pts = Math.min(searchCount, 3) * 10;
      score += pts;
      signals.push({ name: 'search', value: searchCount, weight: 10 });
    }

    if (pageViewCount >= 5) {
      score += 10;
      signals.push({ name: 'high_page_views', value: pageViewCount, weight: 10 });
    }

    const intentType = score >= 70 ? 'high_purchase' : 'buying';
    const confidence = score >= 50 ? 0.85 : score >= 25 ? 0.60 : 0.35;

    return { intentType, score: Math.min(score, 100), confidence, signals };
  }
}
