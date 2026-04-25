import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CONSUMER_INTENT_TYPES } from '@intent/constants';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectDataSource() private readonly db: DataSource) {}

  async findById(id: string) {
    const [user] = await this.db.query(
      `SELECT id, email, display_name, created_at FROM users WHERE id = $1`,
      [id],
    );
    return user ?? null;
  }

  async getEvents(userId: string, limit: number, offset: number) {
    return this.db.query(
      `SELECT id, event_type, metadata, timestamp
         FROM events
        WHERE user_id = $1
        ORDER BY timestamp DESC
        LIMIT $2 OFFSET $3`,
      [userId, limit, offset],
    );
  }

  async getSessions(userId: string) {
    return this.db.query(
      `SELECT id, start_time, end_time, last_activity_at
         FROM sessions
        WHERE user_id = $1
        ORDER BY start_time DESC
        LIMIT 20`,
      [userId],
    );
  }

  async updateDeclaredIntents(userId: string, intents: string[]) {
    const uniqueIntents = [...new Set(intents)];
    const invalidIntents = uniqueIntents.filter(
      (intent) => !CONSUMER_INTENT_TYPES.includes(intent as (typeof CONSUMER_INTENT_TYPES)[number]),
    );

    if (invalidIntents.length > 0) {
      throw new BadRequestException(
        `Invalid intents: ${invalidIntents.join(', ')}`,
      );
    }

    if (uniqueIntents.length > 5) {
      throw new BadRequestException('Maximum 5 intents allowed');
    }

    const [updated] = await this.db.query(
      `UPDATE users
          SET declared_intents = $2,
              updated_at = NOW()
        WHERE id = $1
      RETURNING id, declared_intents, updated_at`,
      [userId, uniqueIntents],
    );

    return updated ?? null;
  }
}
