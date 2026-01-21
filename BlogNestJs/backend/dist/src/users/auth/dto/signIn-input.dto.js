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
exports.SignInDto = void 0;
const class_validator_1 = require("class-validator");
const constants_1 = require("../../../lib/constants");
class SignInDto {
}
exports.SignInDto = SignInDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: constants_1.VALIDATION_MESSAGES.EMAIL_INVALID }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => !o.phone),
    __metadata("design:type", String)
], SignInDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => !o.email),
    (0, class_validator_1.Matches)(constants_1.VALIDATION_PATTERNS.PHONE, {
        message: constants_1.VALIDATION_MESSAGES.PHONE_INVALID_FORMAT,
    }),
    __metadata("design:type", String)
], SignInDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(constants_1.VALIDATION_LIMITS.PASSWORD_MIN_LENGTH, {
        message: constants_1.VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH,
    }),
    __metadata("design:type", String)
], SignInDto.prototype, "password", void 0);
//# sourceMappingURL=signIn-input.dto.js.map