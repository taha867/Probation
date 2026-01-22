"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSourceOptions = void 0;
const dotenv_1 = require("dotenv");
const user_entity_1 = require("../users/user-entity/user.entity");
const post_entity_1 = require("../posts/post-entity/post.entity");
const comment_entity_1 = require("../comments/comment-entity/comment.entity");
const config_1 = __importDefault(require("./config"));
(0, dotenv_1.config)();
const configValues = (0, config_1.default)();
const dataSourceOptions = {
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
    entities: [user_entity_1.User, post_entity_1.Post, comment_entity_1.Comment],
    migrations: ['dist/migrations/*.js'],
    migrationsTableName: 'migrations',
    synchronize: false, // Never use synchronize in production
    logging: false, // Disable verbose logging to prevent hanging
};
exports.dataSourceOptions = dataSourceOptions;
//# sourceMappingURL=data-source-options.js.map