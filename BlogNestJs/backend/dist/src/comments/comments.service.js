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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const comment_entity_1 = require("./comment.entity");
const post_entity_1 = require("../posts/post.entity");
const app_exception_1 = require("../common/exceptions/app.exception");
const constants_1 = require("../lib/constants");
const { EITHER_POST_ID_OR_PARENT_ID_REQUIRED, POST_ID_REQUIRED } = constants_1.ERROR_MESSAGES;
const { COMMENT_CREATED, COMMENT_UPDATED } = constants_1.SUCCESS_MESSAGES;
let CommentsService = class CommentsService {
    constructor(commentRepository, postRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
    }
    async createCommentOrReply(createCommentDto, userId) {
        const { body, postId, parentId } = createCommentDto;
        // Validate that either postId or parentId is provided
        if (!postId && !parentId) {
            throw new common_1.BadRequestException(EITHER_POST_ID_OR_PARENT_ID_REQUIRED);
        }
        let finalPostId;
        if (parentId) {
            // This is a reply to another comment
            const parentComment = await this.commentRepository.findOne({
                where: { id: parentId },
                select: {
                    id: true,
                    postId: true,
                },
            });
            if (!parentComment) {
                throw new common_1.NotFoundException(constants_1.ERROR_MESSAGES.PARENT_COMMENT_NOT_FOUND);
            }
            finalPostId = parentComment.postId;
        }
        else {
            // This is a top-level comment
            if (!postId) {
                throw new common_1.BadRequestException(POST_ID_REQUIRED);
            }
            const post = await this.postRepository.findOne({
                where: { id: postId },
            });
            if (!post) {
                throw new common_1.NotFoundException(constants_1.ERROR_MESSAGES.POST_NOT_FOUND);
            }
            finalPostId = postId;
        }
        // Create comment
        const comment = this.commentRepository.create({
            body,
            postId: finalPostId,
            userId,
            parentId: parentId || null,
        });
        await this.commentRepository.save(comment);
        // Fetch created comment with relations
        const createdComment = await this.findCommentWithRelations(comment.id);
        if (!createdComment) {
            throw new app_exception_1.AppException('COMMENT_CREATION_FAILED', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return {
            data: createdComment,
            message: COMMENT_CREATED,
        };
    }
    async listTopLevelComments(query) {
        const { postId } = query;
        // If postId is provided, validate that the post exists
        if (postId) {
            const post = await this.postRepository.findOne({
                where: { id: postId },
                select: { id: true },
            });
            if (!post) {
                throw new common_1.NotFoundException(constants_1.ERROR_MESSAGES.POST_NOT_FOUND);
            }
        }
        const whereCondition = {
            parentId: null, // Only top-level comments
        };
        if (postId) {
            whereCondition.postId = postId;
        }
        const comments = await this.commentRepository.find({
            where: whereCondition,
            relations: { author: true },
            select: {
                id: true,
                body: true,
                postId: true,
                userId: true,
                parentId: true,
                createdAt: true,
                updatedAt: true,
                author: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
            order: {
                createdAt: 'DESC',
            },
        });
        const commentRows = comments.map((comment) => {
            const { id, body, postId, userId, parentId, createdAt, updatedAt, author, } = comment;
            return {
                id,
                body,
                postId,
                userId,
                parentId: parentId ?? null,
                createdAt,
                updatedAt,
                author: {
                    id: author.id,
                    name: author.name,
                    email: author.email,
                    image: author.image ?? null,
                },
            };
        });
        return {
            data: commentRows,
        };
    }
    async findCommentWithRelations(id) {
        const comment = await this.commentRepository.findOne({
            where: { id },
            relations: { author: true, post: true },
            select: {
                id: true,
                body: true,
                postId: true,
                userId: true,
                parentId: true,
                createdAt: true,
                updatedAt: true,
                author: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
                post: {
                    id: true,
                    title: true,
                },
            },
        });
        if (!comment) {
            return null;
        }
        // Load replies for this comment
        const replies = await this.commentRepository.find({
            where: { parentId: id },
            relations: { author: true },
            select: {
                id: true,
                body: true,
                postId: true,
                userId: true,
                parentId: true,
                createdAt: true,
                updatedAt: true,
                author: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
            order: {
                createdAt: 'ASC',
            },
        });
        const replyRows = replies.map((reply) => {
            const { id, body, postId, userId, parentId, createdAt, updatedAt, author, } = reply;
            return {
                id,
                body,
                postId,
                userId,
                parentId: parentId ?? null,
                createdAt,
                updatedAt,
                author: {
                    id: author.id,
                    name: author.name,
                    email: author.email,
                    image: author.image ?? null,
                },
            };
        });
        const { id: commentId, body, postId, userId, parentId, createdAt, updatedAt, author, post, } = comment;
        return {
            id: commentId,
            body,
            postId,
            userId,
            parentId: parentId ?? null,
            createdAt,
            updatedAt,
            author: {
                id: author.id,
                name: author.name,
                email: author.email,
                image: author.image ?? null,
            },
            post: {
                id: post.id,
                title: post.title,
            },
            replies: replyRows,
        };
    }
    async updateComment(commentId, userId, updateCommentDto) {
        const comment = await this.commentRepository.findOne({
            where: { id: commentId },
        });
        if (!comment) {
            throw new common_1.NotFoundException(constants_1.ERROR_MESSAGES.COMMENT_NOT_FOUND);
        }
        if (comment.userId !== userId) {
            throw new common_1.ForbiddenException(constants_1.ERROR_MESSAGES.CANNOT_UPDATE_OTHER_COMMENT);
        }
        // Update comment
        comment.body = updateCommentDto.body;
        await this.commentRepository.save(comment);
        // Fetch updated comment with relations
        const updated = await this.findCommentWithRelations(commentId);
        if (!updated) {
            throw new app_exception_1.AppException('COMMENT_UPDATE_FAILED', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return {
            data: updated,
            message: COMMENT_UPDATED,
        };
    }
    async deleteComment(commentId, userId) {
        const comment = await this.commentRepository.findOne({
            where: { id: commentId },
            select: {
                id: true,
                userId: true,
            },
        });
        if (!comment) {
            throw new common_1.NotFoundException(constants_1.ERROR_MESSAGES.COMMENT_NOT_FOUND);
        }
        if (comment.userId !== userId) {
            throw new common_1.ForbiddenException(constants_1.ERROR_MESSAGES.CANNOT_DELETE_OTHER_COMMENT);
        }
        // Delete comment (cascade will delete replies automatically)
        await this.commentRepository.delete(commentId);
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(1, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CommentsService);
//# sourceMappingURL=comments.service.js.map