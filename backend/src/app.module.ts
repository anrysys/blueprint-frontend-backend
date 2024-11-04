// backend/src/app.module.ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { typeOrmConfig } from './config/typeorm.config';
import { LoggerMiddleware } from './logger.middleware';
import { NotificationsController } from './notifications/notifications.controller';
import { NotificationsService } from './notifications/notifications.service';
import { Subscription } from './notifications/subscription.entity';
import { PostsModule } from './posts/posts.module';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { Post } from './posts/post.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeOrmConfig,
      entities: [User, Subscription, Post],
    }),
    UserModule,
    PostsModule,
    AuthModule,
    TypeOrmModule.forFeature([Subscription]),
  ],
  providers: [NotificationsService],
  controllers: [NotificationsController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}