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
exports.PostsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const posts_service_1 = require("./posts.service");
const create_post_input_dto_1 = require("./dto/create-post-input.dto");
const update_post_input_dto_1 = require("./dto/update-post-input.dto");
const list_posts_query_payload_dto_1 = require("./dto/list-posts-query-payload.dto");
const pagination_query_input_dto_1 = require("./dto/pagination-query-input.dto");
const user_decorator_1 = require("../custom-decorators/user.decorator");
const public_decorator_1 = require("../custom-decorators/public.decorator");
const constants_1 = require("../lib/constants");
let PostsController = class PostsController {
    constructor(postsService) {
        this.postsService = postsService;
    }
    async create(createPostDto, userId, file) {
        return this.postsService.createPost(createPostDto, userId, file);
    }
    async list(query) {
        return this.postsService.listPosts(query);
    }
    async getOne(id) {
        const post = await this.postsService.findPostWithAuthor(id);
        if (!post) {
            throw new common_1.NotFoundException(constants_1.ERROR_MESSAGES.POST_NOT_FOUND);
        }
        return {
            data: post,
        };
    }
    async getPostComments(postId, query) {
        return this.postsService.getPostWithComments(postId, query);
    }
    async update(id, updatePostDto, userId, file) {
        // Check if at least one field is being updated
        const hasBodyFields = Object.keys(updatePostDto).length > 0;
        const hasFileUpload = file !== undefined;
        if (!hasBodyFields && !hasFileUpload) {
            throw new common_1.BadRequestException(constants_1.ERROR_MESSAGES.AT_LEAST_ONE_FIELD_REQUIRED);
        }
        return this.postsService.updatePost(id, userId, updatePostDto, file);
    }
    async delete(id, userId) {
        await this.postsService.deletePost(id, userId);
        return {
            data: { message: constants_1.SUCCESS_MESSAGES.POST_DELETED },
        };
    }
};
exports.PostsController = PostsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)('id')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_post_input_dto_1.CreatePostDto, Number, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_posts_query_payload_dto_1.ListPostsQueryDto]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "list", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getOne", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':postId/comments'),
    __param(0, (0, common_1.Param)('postId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, pagination_query_input_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getPostComments", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.User)('id')),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_post_input_dto_1.UpdatePostDto, Number, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, user_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "delete", null);
exports.PostsController = PostsController = __decorate([
    (0, common_1.Controller)('posts'),
    __metadata("design:paramtypes", [posts_service_1.PostsService])
], PostsController);
//# sourceMappingURL=posts.controller.js.map