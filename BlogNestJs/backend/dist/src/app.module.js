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
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const users_module_1 = require("./users/users.module");
const posts_module_1 = require("./posts/posts.module");
const comments_module_1 = require("./comments/comments.module");
const auth_guard_1 = require("./users/auth/guards/auth.guard");
// Exclude migrations from runtime config (only needed for CLI)
const { migrations, migrationsTableName, ...nestOptions } = data_source_options_1.dataSourceOptions;
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                ...nestOptions,
                autoLoadEntities: true,
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    name: 'short', // Short-lived requests (e.g., login)
                    ttl: 1000,
                    limit: 3, // max 3 requests per second
                },
                {
                    name: 'default', // General API usage
                    ttl: 60000, // 1 minute
                    limit: 20, // 20 requests per minute
                },
                {
                    name: 'login', // Login endpoint
                    ttl: 60000, // 1 minute
                    limit: 5, // 5 login attempts per minute
                },
            ]),
            users_module_1.UsersModule, // ← User routes (/users/*) and Auth routes (/auth/*)
            posts_module_1.PostsModule, // ← Post routes (/posts/*)
            comments_module_1.CommentsModule, // ← Comment routes (/comments/*)
        ],
        controllers: [],
        providers: [
            // providers are injectable classes
            {
                provide: core_1.APP_GUARD,
                useClass: auth_guard_1.AuthGuard, // Global auth guard
            },
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard, // Global rate limiting guard
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map