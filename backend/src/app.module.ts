// backend/src/app.module.ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { typeOrmConfig } from './config/typeorm.config';
import { LoggerMiddleware } from './logger.middleware';
import { NotificationsModule } from './notifications/notifications.module'; // Импортируем NotificationsModule
import { User } from './user/user.entity';
import { Subscription } from './notifications/subscription.entity';
import { Post } from './posts/post.entity';
import { PostsModule } from './posts/posts.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeOrmConfig,
      entities: [User, Subscription, Post],
    }),
    UserModule,
    PostsModule,
    AuthModule,
    NotificationsModule, // Импортируем NotificationsModule
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}