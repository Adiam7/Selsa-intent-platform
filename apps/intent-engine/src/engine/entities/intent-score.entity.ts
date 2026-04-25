import { Entity, Column, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('intent_scores')
export class IntentScoreEntity {
  @PrimaryColumn('uuid')
  userId!: string;

  @Column('int')
  score!: number;

  @Column('varchar')
  intentType!: string;

  @Column('float')
  confidence!: number;

  @Column('jsonb', { default: [] })
  signals!: object[];

  @UpdateDateColumn()
  updatedAt!: Date;
}
