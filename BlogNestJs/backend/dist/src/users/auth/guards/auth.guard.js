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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const core_1 = require("@nestjs/core");
const public_decorator_1 = require("../../../custom-decorators/public.decorator");
const constants_1 = require("../../../lib/constants");
const config_1 = __importDefault(require("../../../config/config"));
const { INVALID_TOKEN, ACCESS_TOKEN_REQUIRED, ACCESS_TOKEN_EXPIRED, AUTHENTICATION_FAILED, } = constants_1.ERROR_MESSAGES;
let AuthGuard = class AuthGuard {
    constructor(jwtService, reflector) {
        this.jwtService = jwtService;
        this.reflector = reflector;
        this.config = (0, config_1.default)();
    }
    async canActivate(context) {
        // Check if route is public
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(), // Get the handler (e.g: signIn method)
            context.getClass(), // Get the class (e.g: AuthController)
        ]);
        if (isPublic) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new common_1.UnauthorizedException(ACCESS_TOKEN_REQUIRED);
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.config.jwt.secret,
            });
            if (payload.type !== 'access') {
                throw new common_1.UnauthorizedException(INVALID_TOKEN);
            }
            request.user = { id: payload.userId };
        }
        catch (error) {
            if (error instanceof Error && error.name === 'TokenExpiredError') {
                throw new common_1.UnauthorizedException(ACCESS_TOKEN_EXPIRED);
            }
            if (error instanceof Error && error.name === 'JsonWebTokenError') {
                throw new common_1.UnauthorizedException(INVALID_TOKEN);
            }
            throw new common_1.UnauthorizedException(AUTHENTICATION_FAILED);
        }
        return true;
    }
    extractTokenFromHeader(request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        core_1.Reflector])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map