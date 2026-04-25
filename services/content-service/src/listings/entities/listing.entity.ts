import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('listings')
export class ListingEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  user_id!: string;

  @Column()
  intent_type!: string;

  @Column()
  category!: string;

  @Column()
  title!: string;

  @Column('text')
  description!: string;

  @Column('jsonb', { default: {} })
  metadata!: Record<string, any>;

  @Column({ default: 'active' })
  status!: 'active' | 'completed' | 'archived';

  @CreateDateColumn({ name: 'created_at' })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at!: Date;
}
