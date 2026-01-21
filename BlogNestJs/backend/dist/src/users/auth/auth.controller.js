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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const auth_service_1 = require("./auth.service");
const signIn_input_dto_1 = require("./dto/signIn-input.dto");
const signUp_input_dto_1 = require("./dto/signUp-input.dto");
const forgot_password_input_dto_1 = require("./dto/forgot-password-input.dto");
const reset_password_input_dto_1 = require("./dto/reset-password-input.dto");
const refresh_token_input_dto_1 = require("./dto/refresh-token-input.dto");
const public_decorator_1 = require("../../customDecorators/public.decorator");
const user_decorator_1 = require("../../customDecorators/user.decorator");
const constants_1 = require("../../lib/constants");
const common_2 = require("@nestjs/common");
const emailOrPhone_pipe_1 = require("./pipes/emailOrPhone.pipe");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async signUp(signUpDto) {
        await this.authService.signUp(signUpDto);
        return {
            data: { message: constants_1.SUCCESS_MESSAGES.ACCOUNT_CREATED },
        };
    }
    async signIn(signInDto) {
        return this.authService.signIn(signInDto);
    }
    async signOut(userId) {
        await this.authService.logout(userId);
        return {
            data: { message: constants_1.SUCCESS_MESSAGES.LOGGED_OUT },
        };
    }
    async refreshToken(refreshTokenDto) {
        return this.authService.refreshToken(refreshTokenDto.refreshToken);
    }
    async forgotPassword(forgotPasswordDto) {
        await this.authService.forgotPassword(forgotPasswordDto.email);
        return {
            data: { message: constants_1.SUCCESS_MESSAGES.RESET_TOKEN_SENT },
        };
    }
    async resetPassword(resetPasswordDto) {
        // Validate passwords match
        if (resetPasswordDto.newPassword !== resetPasswordDto.confirmPassword) {
            throw new common_1.BadRequestException(constants_1.ERROR_MESSAGES.PASSWORD_MISSMATCH);
        }
        await this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
        return {
            data: { message: constants_1.SUCCESS_MESSAGES.PASSWORD_RESET },
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signUp_input_dto_1.SignUpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signUp", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, throttler_1.Throttle)({ login: { limit: 5, ttl: 60000 } }),
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_2.UsePipes)(emailOrPhone_pipe_1.EmailOrPhonePipe),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signIn_input_dto_1.SignInDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signIn", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, user_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signOut", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('refreshToken'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_input_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('forgotPassword'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_input_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('resetPassword'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_input_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map