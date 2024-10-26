// src/posts/posts.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async create(post: any): Promise<Post> {
    return this.postsRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return this.postsRepository.find();
  }
}