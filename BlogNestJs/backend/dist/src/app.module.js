"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const data_source_options_1 = require("./config/data-source-options");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const users_module_1 = require("./users/users.module");
const posts_module_1 = require("./posts/posts.module");
const comments_module_1 = require("./comments/comments.module");
const auth_guard_1 = require("./users/auth/guards/auth.guard");
const user_subscriber_1 = require("./users/subscribers/user.subscriber");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true, // Makes ConfigService available globally
                envFilePath: ".env",
            }),
            typeorm_1.TypeOrmModule.forRoot({
                ...data_source_options_1.dataSourceOptions,
                autoLoadEntities: true,
                subscribers: [user_subscriber_1.UserSubscriber], // Register TypeORM entity subscriber
            }),
            throttler_1.ThrottlerModule.forRoot([
                // rate limit per ip address
                {
                    name: "default",
                    ttl: 60000, // 1 minute
                    limit: 100, // 20 requests per minute
                },
                {
                    name: "login", // Login endpoint
                    ttl: 60000, // 1 minute
                    limit: 5, // 5 login attempts per minute
                },
            ]),
            users_module_1.UsersModule,
            posts_module_1.PostsModule,
            comments_module_1.CommentsModule,
        ],
        controllers: [],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: auth_guard_1.AuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard, // rate limiting guard, throws 429 if limit exceeds
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map