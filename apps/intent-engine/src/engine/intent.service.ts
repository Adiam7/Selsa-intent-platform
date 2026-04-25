import { Injectable, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { IntentScore, TrackingEvent } from '@intent/common-types';
import { REDIS_KEYS, TTL, REDIS_CLIENT } from '@intent/constants';
import { clamp } from '@intent/utils';
import { IntentScoreEntity } from './entities/intent-score.entity';
import { PurchaseIntentRule } from './rules/purchase.rule';
import { ChurnRiskRule } from './rules/churn.rule';
import { ResearchIntentRule } from './rules/research.rule';
import { BrowsingIntentRule } from './rules/browsing.rule';
import { IntentRule } from './rules/intent-rule.interface';

@Injectable()
export class IntentService {
  private readonly logger = new Logger(IntentService.name);
  private readonly rules: IntentRule[];

  constructor(
    @InjectRepository(IntentScoreEntity)
    private readonly repo: Repository<IntentScoreEntity>,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {
    this.rules = [
      new PurchaseIntentRule(),
      new ChurnRiskRule(),
      new ResearchIntentRule(),
      new BrowsingIntentRule(),
    ];
  }

  async computeAndStore(userId: string, recentEvents: TrackingEvent[]): Promise<IntentScore> {
    const results = this.rules.map(r => r.evaluate(recentEvents));

    // Pick the rule with the highest score
    const dominant = results.reduce((best, cur) =>
      cur.score > best.score ? cur : best,
    );

    const intentScore: IntentScore = {
      userId,
      score: clamp(dominant.score, 0, 100),
      intentType: dominant.intentType,
      confidence: dominant.confidence,
      signals: dominant.signals,
      updatedAt: new Date(),
    };

    // Write-through cache
    await this.redis.setex(
      REDIS_KEYS.intentScore(userId),
      TTL.INTENT_SCORE,
      JSON.stringify(intentScore),
    );

    // Persist to Postgres (upsert)
    await this.repo.upsert(
      {
        userId: intentScore.userId,
        score: intentScore.score,
        intentType: intentScore.intentType,
        confidence: intentScore.confidence,
        signals: intentScore.signals as object[],
      },
      ['userId'],
    );

    this.logger.debug(
      `[computeAndStore] userId=${userId} → ${intentScore.intentType} (${intentScore.score})`,
    );

    return intentScore;
  }

  async getIntent(userId: string): Promise<IntentScore | null> {
    // 1. Try Redis cache
    const cached = await this.redis.get(REDIS_KEYS.intentScore(userId));
    if (cached) {
      return JSON.parse(cached) as IntentScore;
    }

    // 2. Fall back to Postgres
    const entity = await this.repo.findOne({ where: { userId } });
    if (!entity) return null;

    const score: IntentScore = {
      userId: entity.userId,
      score: entity.score,
      intentType: entity.intentType as IntentScore['intentType'],
      confidence: entity.confidence,
      signals: entity.signals as IntentScore['signals'],
      updatedAt: entity.updatedAt,
    };

    // Repopulate cache
    await this.redis.setex(
      REDIS_KEYS.intentScore(userId),
      TTL.INTENT_SCORE,
      JSON.stringify(score),
    );

    return score;
  }
}
