import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { User } from "../entities/User.js";
import { Post } from "../entities/Post.js";
import { Comment } from "../entities/Comment.js";


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  
  // Entities
  entities: [User, Post, Comment],
  
  // Subscribers
  subscribers: [],
  
  // Migrations
  migrations: [__dirname + "/../migrations/*.{ts,js}"],
  migrationsTableName: "migrations",
  migrationsRun: false, // Manual migration control
  
  // Synchronization (DEV ONLY - disable in production)
  synchronize: process.env.NODE_ENV === "development",
  
  // Logging
  logging: process.env.NODE_ENV === "development",
  
  // Connection pool
  extra: {
    max: 10, // Maximum pool size ( maximum number of connection in the pool )
    min: 2,  // Minimum pool size ( minimum number of connection to keep alive )
  },
});

