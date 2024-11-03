import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
@Index(['endpoint', 'keys'], { unique: true })
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  endpoint: string;

  @Column('jsonb')
  keys: {
    p256dh: string;
    auth: string;
  };
}
