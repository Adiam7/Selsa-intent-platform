import { TrackingEvent } from '@intent/common-types';
import { IntentRule, RuleResult } from './intent-rule.interface';

/**
 * Churn risk signals:
 *  session_end with no add_to_cart in session → +20
 *  high scroll depth on pricing/cancel pages   → +30
 *  remove_from_cart events                     → +25 each (max 2)
 *  no activity for >20 min (inferred via sparse events) → +15
 */
export class ChurnRiskRule implements IntentRule {
  evaluate(events: TrackingEvent[]): RuleResult {
    const removeFromCart = events.filter(e => e.eventType === 'remove_from_cart').length;
    const sessionEnds    = events.filter(e => e.eventType === 'session_end').length;
    const addToCart      = events.filter(e => e.eventType === 'add_to_cart').length;
    const pricingViews   = events.filter(
      e => e.eventType === 'page_view' &&
           typeof e.metadata?.['path'] === 'string' &&
           /pricing|cancel|unsubscribe/i.test(e.metadata['path']),
    ).length;

    let score = 0;
    const signals = [];

    if (removeFromCart > 0) {
      const pts = Math.min(removeFromCart, 2) * 25;
      score += pts;
      signals.push({ name: 'remove_from_cart', value: removeFromCart, weight: 25 });
    }

    if (sessionEnds > 0 && addToCart === 0) {
      score += 20;
      signals.push({ name: 'session_end_no_cart', value: sessionEnds, weight: 20 });
    }

    if (pricingViews > 0) {
      score += 30;
      signals.push({ name: 'pricing_page_views', value: pricingViews, weight: 30 });
    }

    const confidence = score >= 50 ? 0.75 : 0.45;

    return {
      intentType: 'churn_risk',
      score: Math.min(score, 100),
      confidence,
      signals,
    };
  }
}
