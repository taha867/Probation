"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const users_service_1 = require("./users.service");
const listUsersQuery_dto_1 = require("./dto/listUsersQuery.dto");
const getUserPostsQuery_dto_1 = require("./dto/getUserPostsQuery.dto");
const updateUser_dto_1 = require("./dto/updateUser.dto");
const user_decorator_1 = require("../common/decorators/user.decorator");
const public_decorator_1 = require("./auth/decorators/public.decorator");
const constants_1 = require("../lib/constants");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async list(query) {
        return this.usersService.listUsers(query);
    }
    async getCurrentUser(userId) {
        return this.usersService.findUserById(userId);
    }
    async getUserPosts(id, query) {
        return this.usersService.getUserPostsWithComments(id, query);
    }
    async update(id, updateUserDto, userId, file) {
        // Check if at least one field is being updated
        const hasBodyFields = Object.keys(updateUserDto).length > 0;
        const hasFileUpload = file !== undefined;
        if (!hasBodyFields && !hasFileUpload) {
            throw new common_1.BadRequestException(constants_1.ERROR_MESSAGES.AT_LEAST_ONE_FIELD_REQUIRED);
        }
        return this.usersService.updateUser(id, userId, updateUserDto, file);
    }
    async delete(id, userId) {
        await this.usersService.deleteUser(id, userId);
        return {
            data: { message: constants_1.SUCCESS_MESSAGES.USER_DELETED },
        };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [listUsersQuery_dto_1.ListUsersQueryDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, user_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getCurrentUser", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id/posts'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, getUserPostsQuery_dto_1.GetUserPostsQueryDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserPosts", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.User)('id')),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, updateUser_dto_1.UpdateUserDto, Number, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, user_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "delete", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map