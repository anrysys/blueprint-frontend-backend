import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  endpoint: string;

  @Column('json')
  keys: {
    p256dh: string;
    auth: string;
  };
}
