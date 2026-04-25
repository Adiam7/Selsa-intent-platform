import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SessionCleanupJob {
  private readonly logger = new Logger(SessionCleanupJob.name);

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  /**
   * Runs every 15 minutes.
   * Closes sessions that have had no activity for >30 minutes.
   */
  @Cron(CronExpression.EVERY_30_MINUTES)
  async closeStaleSessions() {
    this.logger.log('Running stale session cleanup...');

    const result = await this.dataSource.query(`
      UPDATE sessions
      SET    end_time = NOW()
      WHERE  end_time IS NULL
        AND  last_activity_at < NOW() - INTERVAL '30 minutes'
      RETURNING id
    `);

    this.logger.log(`Closed ${(result as unknown[]).length} stale sessions`);
  }

  /**
   * Runs daily at 03:00 UTC.
   * Purges raw events older than the configured retention window.
   */
  @Cron('0 3 * * *')
  async purgeOldEvents() {
    const retentionDays = parseInt(process.env.EVENT_RETENTION_DAYS ?? '90', 10);
    this.logger.log(`Purging events older than ${retentionDays} days...`);

    const result = await this.dataSource.query(`
      DELETE FROM events
      WHERE timestamp < NOW() - INTERVAL '${retentionDays} days'
    `);

    this.logger.log(`Purged ${(result as unknown[]).length} old events`);
  }
}
