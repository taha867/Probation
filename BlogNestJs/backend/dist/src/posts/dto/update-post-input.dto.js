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
exports.UpdatePostDto = void 0;
const class_validator_1 = require("class-validator");
const post_entity_1 = require("../post.entity");
const constants_1 = require("../../lib/constants");
class UpdatePostDto {
}
exports.UpdatePostDto = UpdatePostDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1, { message: constants_1.VALIDATION_MESSAGES.TITLE_MIN_LENGTH }),
    (0, class_validator_1.MaxLength)(200, { message: constants_1.VALIDATION_MESSAGES.TITLE_MAX_LENGTH }),
    (0, class_validator_1.Matches)(constants_1.VALIDATION_PATTERNS.NO_HTML_TAGS, {
        message: constants_1.VALIDATION_MESSAGES.TITLE_INVALID_CHARS,
    }),
    __metadata("design:type", String)
], UpdatePostDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1, { message: constants_1.VALIDATION_MESSAGES.BODY_MIN_LENGTH }),
    (0, class_validator_1.MaxLength)(5000, { message: 'Post body must not exceed 5000 characters' }),
    (0, class_validator_1.Matches)(constants_1.VALIDATION_PATTERNS.NO_HTML_TAGS, {
        message: constants_1.VALIDATION_MESSAGES.BODY_INVALID_CHARS,
    }),
    __metadata("design:type", String)
], UpdatePostDto.prototype, "body", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(post_entity_1.PostStatus, { message: constants_1.VALIDATION_MESSAGES.STATUS_INVALID }),
    __metadata("design:type", String)
], UpdatePostDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], UpdatePostDto.prototype, "image", void 0);
//# sourceMappingURL=update-post-input.dto.js.map