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
exports.Comment = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
/**
 * Comment entity
 * Represents a comment on a post, with support for nested replies
 * Extends BaseEntity for automatic timestamp management
 */
let Comment = class Comment extends BaseEntity_1.BaseEntity {
};
exports.Comment = Comment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)() //Auto increment
    ,
    __metadata("design:type", Number)
], Comment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }) // nullable if true relation column can be null
    ,
    __metadata("design:type", String)
], Comment.prototype, "body", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "integer" }),
    __metadata("design:type", Number)
], Comment.prototype, "postId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "integer" }),
    __metadata("design:type", Number)
], Comment.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "integer", nullable: true }),
    __metadata("design:type", Object)
], Comment.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)("Post", (post) => post.comments, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "postId" }),
    __metadata("design:type", Function)
], Comment.prototype, "post", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)("User", (user) => user.comments, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "userId" }),
    __metadata("design:type", Function)
], Comment.prototype, "author", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)("Comment", (comment) => comment.replies, {
        nullable: true,
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "parentId" }),
    __metadata("design:type", Object)
], Comment.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.OneToMany)("Comment", (comment) => comment.parent, {
        cascade: true,
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], Comment.prototype, "replies", void 0);
exports.Comment = Comment = __decorate([
    (0, typeorm_1.Entity)("Comments")
], Comment);
//# sourceMappingURL=Comment.js.map