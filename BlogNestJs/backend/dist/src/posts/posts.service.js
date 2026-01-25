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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const post_entity_1 = require("./post-entity/post.entity");
const comment_entity_1 = require("../comments/comment-entity/comment.entity");
const user_entity_1 = require("../users/user-entity/user.entity");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const pagination_service_1 = require("../pagination/pagination.service");
const app_exception_1 = require("../common/exceptions/app.exception");
const constants_1 = require("../lib/constants");
let PostsService = class PostsService {
    constructor(postRepository, commentRepository, userRepository, cloudinaryService, paginationService) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.cloudinaryService = cloudinaryService;
        this.paginationService = paginationService;
    }
    async createPost(createPostDto, userId, file) {
        const { title, body, status = post_entity_1.PostStatus.DRAFT } = createPostDto;
        let imageUrl = null;
        let imagePublicId = null;
        // Upload image if provided
        if (file) {
            const uploadResult = await this.cloudinaryService.uploadImage(file.buffer, constants_1.DEFAULTS.CLOUDINARY_POSTS_FOLDER, file.originalname || constants_1.DEFAULTS.CLOUDINARY_POST_IMAGE_NAME);
            imageUrl = uploadResult.secure_url;
            imagePublicId = uploadResult.public_id;
        }
        const post = this.postRepository.create({
            title,
            body,
            status,
            userId,
            image: imageUrl,
            imagePublicId,
        });
        await this.postRepository.save(post);
        // Fetch post with author
        const postWithAuthor = await this.findPostWithAuthor(post.id);
        if (!postWithAuthor) {
            throw new app_exception_1.AppException("POST_CREATION_FAILED", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return {
            data: postWithAuthor,
            message: constants_1.SUCCESS_MESSAGES.POST_CREATED,
        };
    }
    async listPosts(query) {
        const { page, limit, search, userId, status } = query;
        // Validate userId exists if provided
        if (userId) {
            const userExists = await this.userRepository.exists({
                where: { id: userId },
            });
            if (!userExists) {
                throw new common_1.NotFoundException(constants_1.ERROR_MESSAGES.USER_NOT_FOUND);
            }
        }
        const qb = this.postRepository
            .createQueryBuilder("post")
            .leftJoinAndSelect("post.author", "author")
            .select([
            "post.id",
            "post.title",
            "post.body",
            "post.userId",
            "post.status",
            "post.image",
            "post.imagePublicId",
            "post.createdAt",
            "post.updatedAt",
            "author.id",
            "author.name",
            "author.email",
            "author.image",
        ]);
        if (userId) {
            qb.andWhere("post.userId = :userId", { userId });
        }
        if (status) {
            qb.andWhere("post.status = :status", { status });
        }
        if (search) {
            qb.andWhere(new typeorm_2.Brackets((qb) => {
                qb.where("post.title ILIKE :search", {
                    search: `%${search}%`,
                }).orWhere("post.body ILIKE :search", { search: `%${search}%` });
            }));
        }
        qb.orderBy("post.createdAt", "DESC");
        const paginatedResult = await this.paginationService.paginateQueryBuilder(qb, page, limit);
        const postRows = paginatedResult.data.items.map((post) => {
            const { id, title, body, userId, status, image, imagePublicId, createdAt, author: { id: authorId, name, email, image: authorImage }, } = post;
            return {
                id,
                title,
                body,
                userId,
                status: status,
                image: image ?? null,
                imagePublicId: imagePublicId ?? null,
                createdAt,
                author: {
                    id: authorId,
                    name,
                    email,
                    image: authorImage ?? null,
                },
            };
        });
        return {
            data: {
                items: postRows,
                paginationOptions: paginatedResult.data.paginationOptions,
            },
        };
    }
    async findPostWithAuthor(id) {
        const post = await this.postRepository.findOne({
            where: { id },
            relations: { author: true },
            select: {
                id: true,
                title: true,
                body: true,
                userId: true,
                status: true,
                image: true,
                imagePublicId: true,
                createdAt: true,
                author: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
        });
        if (!post) {
            return null;
        }
        const { id: postId, title, body, userId, status, image, imagePublicId, createdAt, author, } = post;
        return {
            id: postId,
            title,
            body,
            userId,
            status: status,
            image: image ?? null,
            imagePublicId: imagePublicId ?? null,
            createdAt,
            author: {
                id: author.id,
                name: author.name,
                email: author.email,
                image: author.image ?? null,
            },
        };
    }
    async getPostWithComments(postId, query) {
        const { page, limit } = query;
        const post = await this.postRepository.findOne({
            where: { id: postId },
            select: {
                id: true,
                title: true,
                body: true,
                userId: true,
                status: true,
                image: true,
                imagePublicId: true,
                createdAt: true,
            },
        });
        if (!post) {
            throw new common_1.NotFoundException(constants_1.ERROR_MESSAGES.POST_NOT_FOUND);
        }
        const { id, title, body, userId, status, image, imagePublicId } = post;
        const basePost = {
            id,
            title,
            body,
            userId,
            status: status,
            image: image ?? null,
            imagePublicId: imagePublicId ?? null,
            createdAt: post.createdAt,
        };
        // Get top-level comments with replies
        const qb = this.commentRepository
            .createQueryBuilder("comment")
            .leftJoinAndSelect("comment.author", "author")
            .leftJoinAndSelect("comment.replies", "reply")
            .leftJoinAndSelect("reply.author", "replyAuthor")
            .where("comment.postId = :postId", { postId })
            .andWhere("comment.parentId IS NULL")
            .orderBy("comment.createdAt", "DESC")
            .addOrderBy("reply.createdAt", "ASC");
        const paginatedResult = await this.paginationService.paginateQueryBuilder(qb, page, limit);
        return {
            data: {
                post: basePost,
                comments: paginatedResult.data.items,
                paginationOptions: paginatedResult.data.paginationOptions,
            },
        };
    }
    async updatePost(postId, userId, updatePostDto, file) {
        const post = await this.postRepository.findOne({
            where: { id: postId },
        });
        if (!post) {
            throw new common_1.NotFoundException(constants_1.ERROR_MESSAGES.POST_NOT_FOUND);
        }
        if (post.userId !== userId) {
            throw new common_1.ForbiddenException(constants_1.ERROR_MESSAGES.CANNOT_UPDATE_OTHER_POST);
        }
        const { title, body, status, image } = updatePostDto;
        const updateData = {};
        if (title !== undefined)
            updateData.title = title;
        if (body !== undefined)
            updateData.body = body;
        if (status !== undefined)
            updateData.status = status;
        // Handle image upload/removal
        if (file) {
            // New image uploaded: delete old image, upload new one
            if (post.imagePublicId) {
                await this.cloudinaryService.deleteImage(post.imagePublicId);
            }
            const uploadResult = await this.cloudinaryService.uploadImage(file.buffer, constants_1.DEFAULTS.CLOUDINARY_POSTS_FOLDER, file.originalname || constants_1.DEFAULTS.CLOUDINARY_POST_IMAGE_NAME);
            updateData.image = uploadResult.secure_url;
            updateData.imagePublicId = uploadResult.public_id;
        }
        else if (image === null || image === "") {
            // Image explicitly removed
            if (post.imagePublicId) {
                await this.cloudinaryService.deleteImage(post.imagePublicId);
            }
            updateData.image = null;
            updateData.imagePublicId = null;
        }
        // Update post
        Object.assign(post, updateData);
        await this.postRepository.save(post);
        // Fetch updated post with author
        const postWithAuthor = await this.findPostWithAuthor(post.id);
        if (!postWithAuthor) {
            throw new app_exception_1.AppException("POST_UPDATE_FAILED", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return {
            data: postWithAuthor,
            message: constants_1.SUCCESS_MESSAGES.POST_UPDATED,
        };
    }
    async deletePost(postId, userId) {
        const post = await this.postRepository.findOne({
            where: { id: postId },
            select: {
                id: true,
                userId: true,
                imagePublicId: true,
            },
        });
        if (!post) {
            throw new common_1.NotFoundException(constants_1.ERROR_MESSAGES.POST_NOT_FOUND);
        }
        if (post.userId !== userId) {
            throw new common_1.ForbiddenException(constants_1.ERROR_MESSAGES.CANNOT_DELETE_OTHER_POST);
        }
        // Delete associated image from Cloudinary
        if (post.imagePublicId) {
            await this.cloudinaryService.deleteImage(post.imagePublicId);
        }
        // Delete post (cascade will delete comments)
        await this.postRepository.delete(postId);
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __param(1, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        cloudinary_service_1.CloudinaryService,
        pagination_service_1.PaginationService])
], PostsService);
//# sourceMappingURL=posts.service.js.map