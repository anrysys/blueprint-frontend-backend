// src/user/user.entity.ts

import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../posts/post.entity';
import { Subscription } from '../notifications/subscription.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  username: string;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Post, post => post.user)
  posts: Post[];

  @OneToMany(() => Subscription, subscription => subscription.user)
  subscriptions: Subscription[];

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}