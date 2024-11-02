import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { typeOrmConfig } from './config/typeorm.config';
import { LoggerMiddleware } from './logger.middleware';
import { PostsModule } from './posts/posts.module';
import { UserModule } from './user/user.module';
import { UsersModule } from './users/users.module';
import { NotificationsService } from './notifications/notifications.service';
import { Subscription } from './notifications/subscription.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UsersModule,
    PostsModule,
    AuthModule,
    UserModule,
    TypeOrmModule.forFeature([Subscription]),
  ],
  providers: [NotificationsService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}