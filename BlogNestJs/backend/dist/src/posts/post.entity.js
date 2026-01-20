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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = exports.PostStatus = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("../common/entities/BaseEntity");
/**
 * Post status enum, best for roles, status, updates, etc.
 */
var PostStatus;
(function (PostStatus) {
    PostStatus["DRAFT"] = "draft";
    PostStatus["PUBLISHED"] = "published";
})(PostStatus || (exports.PostStatus = PostStatus = {}));
/**
 * Post entity
 * Represents a blog post in the database
 * Extends BaseEntity for automatic timestamp management
 */
let Post = class Post extends BaseEntity_1.BaseEntity {
};
exports.Post = Post;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Post.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Post.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Post.prototype, "body", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], Post.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PostStatus,
        default: PostStatus.DRAFT,
    }),
    __metadata("design:type", String)
], Post.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Post.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], Post.prototype, "imagePublicId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('User', (user) => user.posts, { onDelete: 'CASCADE' }) //delays evaluation untill runtime -> no crash
    ,
    (0, typeorm_1.JoinColumn)({ name: 'userId' }) // foreign key owner
    ,
    __metadata("design:type", Function)
], Post.prototype, "author", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Comment', (comment) => comment.post, {
        cascade: true,
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Array)
], Post.prototype, "comments", void 0);
exports.Post = Post = __decorate([
    (0, typeorm_1.Entity)('Posts')
], Post);
//# sourceMappingURL=post.entity.js.map