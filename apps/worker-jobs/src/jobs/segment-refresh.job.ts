import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SegmentRefreshJob {
  private readonly logger = new Logger(SegmentRefreshJob.name);

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  /**
   * Re-evaluates segment membership every hour.
   * For each segment, runs its rules against user data and
   * syncs the user_segments junction table.
   */
  @Cron('0 * * * *')
  async refreshSegments() {
    this.logger.log('Refreshing segment memberships...');

    const segments = await this.dataSource.query(
      `SELECT id, name, rules_json, operator FROM segments`,
    ) as Array<{ id: string; name: string; rules_json: unknown; operator: string }>;

    this.logger.log(`Processing ${segments.length} segments`);

    for (const segment of segments) {
      try {
        await this.evaluateSegment(segment);
      } catch (err) {
        this.logger.error(`Failed to refresh segment ${segment.id}: ${err}`);
      }
    }

    this.logger.log('Segment refresh complete');
  }

  private async evaluateSegment(segment: { id: string; name: string }) {
    // TODO: parse rules_json and build dynamic SQL / compare against intent_scores
    this.logger.debug(`Evaluating segment: ${segment.name}`);
  }
}
