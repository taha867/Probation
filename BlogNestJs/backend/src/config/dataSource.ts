import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Post } from '../entities/Post';
import { Comment } from '../entities/Comment';

// Load .env file - try multiple paths to work with CLI
const envPath = resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

/**
 * DataSource configuration for TypeORM migrations
 * This file is only used for running migrations via CLI
 * The actual database connection is handled by DatabaseModule in NestJS
 */
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Post, Comment],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false, // Never use synchronize in production
  logging: false, // Disable verbose logging to prevent hanging
});

export default AppDataSource;

