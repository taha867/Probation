"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSourceOptions = void 0;
const dotenv_1 = require("dotenv");
const user_entity_1 = require("../users/user.entity");
const post_entity_1 = require("../posts/post.entity");
const comment_entity_1 = require("../comments/comment.entity");
(0, dotenv_1.config)();
const dataSourceOptions = {
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
    entities: [user_entity_1.User, post_entity_1.Post, comment_entity_1.Comment],
    migrations: ['dist/migrations/*.js'],
    migrationsTableName: 'migrations',
    synchronize: false, // Never use synchronize in production
    logging: false, // Disable verbose logging to prevent hanging
};
exports.dataSourceOptions = dataSourceOptions;
//# sourceMappingURL=data-source-options.js.map