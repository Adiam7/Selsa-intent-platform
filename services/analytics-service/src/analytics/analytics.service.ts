import { Injectable, Logger, Inject } from '@nestjs/common';
import type { ClickHouseClient } from '@clickhouse/client';
import { AnalyticsQueryInput } from '@intent/event-schemas';

const CLICKHOUSE_CLIENT = 'CLICKHOUSE_CLIENT';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    @Inject(CLICKHOUSE_CLIENT) private readonly ch: ClickHouseClient,
  ) {}

  async queryEvents(input: AnalyticsQueryInput) {
    const { startDate, endDate, eventType, userId, groupBy } = input;

    const dateFormat = {
      hour: "toStartOfHour(timestamp)",
      day: "toDate(timestamp)",
      week: "toStartOfWeek(timestamp)",
      month: "toStartOfMonth(timestamp)",
    }[groupBy];

    const filters: string[] = [
      `timestamp >= '${startDate}'`,
      `timestamp <= '${endDate}'`,
    ];
    if (eventType) filters.push(`event_type = '${eventType}'`);
    if (userId) filters.push(`user_id = '${userId}'`);

    const sql = `
      SELECT
        ${dateFormat} AS period,
        event_type,
        count()        AS event_count,
        uniq(user_id)  AS unique_users
      FROM events
      WHERE ${filters.join(' AND ')}
      GROUP BY period, event_type
      ORDER BY period ASC
    `;

    this.logger.debug(`[queryEvents] ${sql}`);
    const result = await this.ch.query({ query: sql, format: 'JSONEachRow' });
    return result.json();
  }

  async getFunnel(steps: string[], startDate: string, endDate: string) {
    // ClickHouse windowFunnel function
    const stepConditions = steps
      .map((s, i) => `${i + 1} = event_type = '${s}'`)
      .join(', ');

    const sql = `
      SELECT
        level,
        count() AS users
      FROM (
        SELECT
          user_id,
          windowFunnel(86400)(timestamp, ${stepConditions}) AS level
        FROM events
        WHERE timestamp BETWEEN '${startDate}' AND '${endDate}'
        GROUP BY user_id
      )
      GROUP BY level
      ORDER BY level ASC
    `;

    const result = await this.ch.query({ query: sql, format: 'JSONEachRow' });
    return result.json();
  }
}
