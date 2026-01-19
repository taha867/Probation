import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/User';
import { Post } from '../entities/Post';
import { Comment } from '../entities/Comment';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Post, Comment],
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: 'migrations',
  migrationsRun: false, // Set to true to auto-run migrations on startup
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  extra: {
    max: 10,
    min: 2,
  },
};

