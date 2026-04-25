import { Injectable, Logger } from '@nestjs/common';
import { Recommendation } from '@intent/common-types';

/**
 * Stub service — extend with:
 *  - Collaborative filtering (users-like-this)
 *  - Embedding-based similarity (vector DB: Pinecone / Weaviate)
 *  - LLM classification via Python sidecar
 */
@Injectable()
export class RecommendationsService {
  private readonly logger = new Logger(RecommendationsService.name);

  async getForUser(userId: string): Promise<Recommendation[]> {
    this.logger.debug(`[getForUser] userId=${userId}`);
    // TODO: call ML sidecar or vector DB
    return [];
  }
}
