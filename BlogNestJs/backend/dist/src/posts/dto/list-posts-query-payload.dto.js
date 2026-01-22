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
exports.ListPostsQueryDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const post_entity_1 = require("../post-entity/post.entity");
const constants_1 = require("../../lib/constants");
class ListPostsQueryDto {
    constructor() {
        this.page = 1;
        this.limit = 10;
    }
}
exports.ListPostsQueryDto = ListPostsQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(constants_1.VALIDATION_LIMITS.PAGE_MIN, { message: constants_1.VALIDATION_MESSAGES.PAGE_INVALID }),
    __metadata("design:type", Number)
], ListPostsQueryDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(constants_1.VALIDATION_LIMITS.LIMIT_MIN, {
        message: constants_1.VALIDATION_MESSAGES.LIMIT_MIN_INVALID,
    }),
    (0, class_validator_1.Max)(constants_1.VALIDATION_LIMITS.LIMIT_MAX, {
        message: constants_1.VALIDATION_MESSAGES.LIMIT_MAX_INVALID,
    }),
    __metadata("design:type", Number)
], ListPostsQueryDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ListPostsQueryDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1, { message: 'User ID must be a positive integer' }),
    __metadata("design:type", Number)
], ListPostsQueryDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(post_entity_1.PostStatus, { message: constants_1.VALIDATION_MESSAGES.STATUS_INVALID }),
    __metadata("design:type", String)
], ListPostsQueryDto.prototype, "status", void 0);
//# sourceMappingURL=list-posts-query-payload.dto.js.map