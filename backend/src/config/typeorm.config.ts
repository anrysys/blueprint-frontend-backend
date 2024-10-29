import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Post } from '../posts/post.entity';
import { User } from '../users/user.entity';

//dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Post],
  synchronize: false, // Измените на false для использования миграций
};

export const AppDataSource = new DataSource({
  type: 'postgres',
  ...typeOrmConfig,
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
});

