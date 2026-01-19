"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const User_1 = require("../entities/User");
const Post_1 = require("../entities/Post");
const Comment_1 = require("../entities/Comment");
exports.databaseConfig = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User_1.User, Post_1.Post, Comment_1.Comment],
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
//# sourceMappingURL=database.config.js.map