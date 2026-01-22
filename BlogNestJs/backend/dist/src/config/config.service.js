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
exports.AppConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
/**
 * Centralized configuration service
 * Single source of truth for all environment variables
 */
let AppConfigService = class AppConfigService {
    constructor(configService) {
        this.configService = configService;
    }
    // Application Configuration
    get nodeEnv() {
        return this.configService.get('NODE_ENV', { infer: true }) || 'development';
    }
    get port() {
        return this.configService.get('PORT', { infer: true }) || 3000;
    }
    get frontendUrl() {
        return this.configService.get('FRONTEND_URL', { infer: true }) || 'http://localhost:5173';
    }
    // Database Configuration
    get database() {
        return {
            host: this.configService.get('DB_HOST', { infer: true }),
            port: this.configService.get('DB_PORT', { infer: true }) || 5432,
            username: this.configService.get('DB_USERNAME', { infer: true }),
            password: this.configService.get('DB_PASSWORD', { infer: true }),
            name: this.configService.get('DB_NAME', { infer: true }),
        };
    }
    // JWT Configuration
    get jwt() {
        return {
            secret: this.configService.get('JWT_SECRET', { infer: true }),
            accessTokenExpiresIn: '15m',
            refreshTokenExpiresIn: '7d',
            resetTokenExpiresIn: '1h',
        };
    }
    // Cloudinary Configuration
    get cloudinary() {
        return {
            cloudName: this.configService.get('CLOUDINARY_CLOUD_NAME', { infer: true }),
            apiKey: this.configService.get('CLOUDINARY_API_KEY', { infer: true }),
            apiSecret: this.configService.get('CLOUDINARY_API_SECRET', { infer: true }),
        };
    }
    // Email Configuration
    get email() {
        return {
            host: this.configService.get('EMAIL_HOST', { infer: true }),
            port: this.configService.get('EMAIL_PORT', { infer: true }),
            secure: this.configService.get('EMAIL_SECURE', { infer: true }) || false,
            user: this.configService.get('EMAIL_USER', { infer: true }),
            pass: this.configService.get('EMAIL_PASS', { infer: true }),
            from: this.configService.get('EMAIL_FROM', { infer: true }),
        };
    }
    // Helper method to get raw config value (for edge cases)
    get(key) {
        return this.configService.get(key, { infer: true });
    }
};
exports.AppConfigService = AppConfigService;
exports.AppConfigService = AppConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppConfigService);
//# sourceMappingURL=config.service.js.map