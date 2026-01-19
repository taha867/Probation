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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
let User = class User extends BaseEntity_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.phone = null;
    }
    // Entity Listner
    // Custom method to exclude password from JSON, it never fails
    toJSON() {
        const { password, toJSON, ...rest } = this;
        return rest;
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)() //Auto increment
    ,
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", unique: true, nullable: true }) // nullable if true relation column can be null
    ,
    __metadata("design:type", Object)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", select: false }) // select false stores password but never return password in queries, it fails when Explicit select: ["password"]
    ,
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }) // nullable: true ensures your database allows empty rows.
    ,
    __metadata("design:type", Object)
], User.prototype, "imagePublicId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", name: "last_login_at", nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "lastLoginAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "integer", default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "tokenVersion", void 0);
__decorate([
    (0, typeorm_1.OneToMany)("Post", (post) => post.author, {
        cascade: true,
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], User.prototype, "posts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)("Comment", (comment) => comment.author, {
        cascade: true,
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], User.prototype, "comments", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)("Users")
], User);
//# sourceMappingURL=User.js.map