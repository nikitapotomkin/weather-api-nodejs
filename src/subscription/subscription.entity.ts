import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { SubscriptionFrequency } from '../common/utils/db-enums';

@Entity('subscriptions')
@Index(['email', 'isConfirmed'])
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  city: string;

  @Column({ type: 'enum', enum: SubscriptionFrequency })
  frequency: string;

  @Column({ unique: true })
  token: string;

  @Column({ name: 'is_confirmed', default: false })
  isConfirmed: boolean;

  @CreateDateColumn({ name: 'created_id' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
