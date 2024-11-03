import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@Index(['endpoint', 'keys'], { unique: true })
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  endpoint: string;

  @Column('jsonb', { nullable: false, default: '{}' })
  keys: {
    p256dh: string;
    auth: string;
  };
}
