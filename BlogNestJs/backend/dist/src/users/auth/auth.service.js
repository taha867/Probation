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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const user_entity_1 = require("../user.entity");
const email_service_1 = require("../../email/email.service");
const bcrypt_1 = require("../../lib/utils/bcrypt");
const constants_1 = require("../../lib/constants");
const app_exception_1 = require("../../common/exceptions/app.exception");
let AuthService = class AuthService {
    constructor(userRepository, jwtService, emailService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    async signUp(signUpDto) {
        const { name, email, phone, password, image } = signUpDto;
        const exists = await this.userRepository.exists({
            where: [{ email }, { phone }],
        });
        if (exists) {
            throw new app_exception_1.AppException('USER_ALREADY_EXISTS', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        // Password will be automatically hashed by UserSubscriber before insert
        await this.userRepository.save({
            name,
            email,
            password, // Plain password - will be hashed automatically by UserSubscriber
            phone: phone || null,
            image: image || null,
            status: constants_1.USER_STATUS.LOGGED_OUT,
        });
    }
    async signIn(signInDto) {
        const { email, phone, password } = signInDto;
        const user = await this.userRepository.findOne({
            where: email ? { email } : { phone },
            select: [
                'id',
                'name',
                'email',
                'phone',
                'password',
                'status',
                'image',
                'tokenVersion',
            ],
        });
        if (!user || !user.password) {
            throw new common_1.UnauthorizedException('INVALID_CREDENTIALS');
        }
        const isPasswordValid = await (0, bcrypt_1.comparePassword)(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('INVALID_CREDENTIALS');
        }
        await this.userRepository.update(user.id, {
            status: constants_1.USER_STATUS.LOGGED_IN,
            lastLoginAt: new Date(),
        });
        const { id, name, email: userEmail, phone: userPhone, status: userStatus, image, tokenVersion = 0, } = user;
        const accessToken = await this.jwtService.signAsync({
            userId: id,
            email: userEmail,
            tokenVersion,
            type: 'access',
        }, { expiresIn: '15m' });
        const refreshToken = await this.jwtService.signAsync({ userId: id, tokenVersion, type: 'refresh' }, { expiresIn: '7d' });
        return {
            data: {
                message: constants_1.SUCCESS_MESSAGES.SIGNED_IN,
                accessToken,
                refreshToken,
                user: {
                    id,
                    name,
                    email: userEmail,
                    phone: userPhone,
                    image: image ?? null,
                    status: userStatus,
                },
            },
        };
    }
    async logout(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('USER_NOT_FOUND');
        }
        const { tokenVersion = 0 } = user;
        await this.userRepository.save({
            ...user,
            status: constants_1.USER_STATUS.LOGGED_OUT,
            tokenVersion: tokenVersion + 1,
        });
    }
    async refreshToken(refreshToken) {
        let decoded;
        try {
            decoded = await this.jwtService.verifyAsync(refreshToken, {
                secret: process.env.JWT_SECRET,
            });
        }
        catch (error) {
            if (error instanceof Error && error.name === 'TokenExpiredError') {
                throw new common_1.UnauthorizedException('REFRESH_TOKEN_EXPIRED');
            }
            throw new common_1.UnauthorizedException('INVALID_REFRESH_TOKEN');
        }
        if (decoded.type !== 'refresh') {
            throw new common_1.UnauthorizedException('INVALID_REFRESH_TOKEN');
        }
        const user = await this.userRepository.findOne({
            where: { id: decoded.userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('USER_NOT_FOUND');
        }
        const { id, email, tokenVersion = 0 } = user;
        if (tokenVersion !== decoded.tokenVersion) {
            throw new common_1.UnauthorizedException('INVALID_REFRESH_TOKEN');
        }
        const accessToken = await this.jwtService.signAsync({
            userId: id,
            email,
            tokenVersion,
            type: 'access',
        }, { expiresIn: '15m' });
        return {
            data: {
                message: constants_1.SUCCESS_MESSAGES.TOKEN_REFRESHED,
                accessToken,
            },
        };
    }
    async forgotPassword(email) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            // Security best practice: don't reveal if email exists
            return;
        }
        const resetToken = await this.jwtService.signAsync({ userId: user.id, type: 'password_reset' }, { expiresIn: '1h' });
        await this.emailService.sendPasswordResetEmail(email, resetToken, user.name || constants_1.DEFAULTS.USER_NAME);
    }
    async resetPassword(token, newPassword) {
        let decoded;
        try {
            decoded = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
        }
        catch (error) {
            if (error instanceof Error && error.name === 'TokenExpiredError') {
                throw new common_1.UnauthorizedException('RESET_TOKEN_EXPIRED');
            }
            throw new common_1.UnauthorizedException('INVALID_RESET_TOKEN');
        }
        if (decoded.type !== 'password_reset') {
            throw new common_1.UnauthorizedException('INVALID_RESET_TOKEN');
        }
        const user = await this.userRepository.findOne({
            where: { id: decoded.userId },
            select: ['id', 'password'],
        });
        if (!user) {
            throw new common_1.NotFoundException('USER_NOT_FOUND');
        }
        const oldPasswordHash = user.password;
        // Password will be automatically hashed by UserSubscriber before update
        user.password = newPassword;
        await this.userRepository.save(user);
        // Verify password was hashed correctly by subscriber
        const updatedUser = await this.userRepository.findOne({
            where: { id: user.id },
            select: ['id', 'password'],
        });
        if (!updatedUser || updatedUser.password === oldPasswordHash) {
            throw new app_exception_1.AppException('PASSWORD_RESET_FAILED', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (!updatedUser.password?.startsWith('$2b$')) {
            throw new app_exception_1.AppException('PASSWORD_RESET_FAILED', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map