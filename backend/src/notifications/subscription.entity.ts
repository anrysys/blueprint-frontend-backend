import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

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

  @ManyToOne(() => User, user => user.subscriptions, { onDelete: 'CASCADE' })
  user: User;
}
