import { config } from 'dotenv';
import { DataSourceOptions } from 'typeorm';
import { User } from '../users/user.entity';
import { Post } from '../posts/post.entity';
import { Comment } from '../comments/comment.entity';

config();

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  name: 'default',
  ssl: {
    rejectUnauthorized: false,
  },
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Post, Comment],
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: 'migrations',
  synchronize: false, // Never use synchronize in production
  logging: false, // Disable verbose logging to prevent hanging
};

export { dataSourceOptions };
