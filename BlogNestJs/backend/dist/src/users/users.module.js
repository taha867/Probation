"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const users_controller_1 = require("./users.controller");
const users_service_1 = require("./users.service");
const auth_controller_1 = require("./auth/auth.controller");
const auth_service_1 = require("./auth/auth.service");
const user_entity_1 = require("./user.entity");
const post_entity_1 = require("../posts/post.entity");
const cloudinary_module_1 = require("../cloudinary/cloudinary.module");
const email_module_1 = require("../email/email.module");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, post_entity_1.Post]),
            jwt_1.JwtModule.register({
                global: true,
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '15m' },
            }),
            cloudinary_module_1.CloudinaryModule,
            email_module_1.EmailModule,
        ],
        controllers: [users_controller_1.UsersController, auth_controller_1.AuthController],
        providers: [users_service_1.UsersService, auth_service_1.AuthService],
        exports: [users_service_1.UsersService, auth_service_1.AuthService],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map