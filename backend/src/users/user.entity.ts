// src/users/user.entity.ts
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../posts/post.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Post, post => post.user)
  posts: Post[];
}