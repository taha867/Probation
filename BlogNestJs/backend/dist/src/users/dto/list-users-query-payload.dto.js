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
exports.ListUsersQueryDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const constants_1 = require("../../lib/constants");
class ListUsersQueryDto {
    constructor() {
        this.page = constants_1.DEFAULTS.PAGINATION_PAGE;
        this.limit = constants_1.DEFAULTS.USERS_LIST_LIMIT;
    }
}
exports.ListUsersQueryDto = ListUsersQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(constants_1.VALIDATION_LIMITS.PAGE_MIN, { message: constants_1.VALIDATION_MESSAGES.PAGE_INVALID }),
    __metadata("design:type", Number)
], ListUsersQueryDto.prototype, "page", void 0);
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
], ListUsersQueryDto.prototype, "limit", void 0);
//# sourceMappingURL=list-users-query-payload.dto.js.map