import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  endpoint: string;

  @Column('json')
  keys: {
    p256dh: string;
    auth: string;
  };
}
