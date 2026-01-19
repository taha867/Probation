"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../../shared/constants/constants");
const app_exception_1 = require("../exceptions/app.exception");
let AppExceptionFilter = class AppExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        if (exception instanceof app_exception_1.AppException) {
            const status = exception.getStatus();
            const message = constants_1.ERROR_MESSAGES[exception.code] ||
                exception.message;
            response.status(status).json({
                data: { message },
            });
            return;
        }
        if (exception instanceof common_1.HttpException) {
            const status = exception.getStatus();
            response.status(status).json({
                data: { message: exception.message },
            });
            return;
        }
        // Unknown error
        console.error('Unhandled error:', exception);
        response.status(500).json({
            data: { message: 'Internal server error' },
        });
    }
};
exports.AppExceptionFilter = AppExceptionFilter;
exports.AppExceptionFilter = AppExceptionFilter = __decorate([
    (0, common_1.Catch)()
], AppExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map