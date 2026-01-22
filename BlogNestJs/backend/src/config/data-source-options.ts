import { config } from 'dotenv';
import { DataSourceOptions } from 'typeorm';
import { User } from '../users/user-entity/user.entity';
import { Post } from '../posts/post-entity/post.entity';
import { Comment } from '../comments/comment-entity/comment.entity';
import appConfig from './config';

config();

const configValues = appConfig();

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  name: 'default',
  ssl: {
    rejectUnauthorized: false,
  },
  host: configValues.database.host,
  port: configValues.database.port,
  username: configValues.database.username,
  password: configValues.database.password,
  database: configValues.database.name,
  entities: [User, Post, Comment],
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: 'migrations',
  synchronize: false, // Never use synchronize in production
  logging: false, // Disable verbose logging to prevent hanging
};

export { dataSourceOptions };
