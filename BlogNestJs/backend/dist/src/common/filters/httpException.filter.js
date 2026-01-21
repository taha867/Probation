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
const constants_1 = require("../../lib/constants");
const app_exception_1 = require("../exceptions/app.exception");
let AppExceptionFilter = class AppExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        if (exception instanceof app_exception_1.AppException) { // is this our business error
            const status = exception.getStatus();
            const message = constants_1.ERROR_MESSAGES[exception.code] ||
                exception.message;
            response.status(status).json({
                data: { message },
            });
            return;
        }
        if (exception instanceof common_1.HttpException) { // http status code eroors
            const status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            // Handle ValidationPipe errors (BadRequestException with array of errors)
            if (typeof exceptionResponse === 'object' &&
                exceptionResponse !== null &&
                'message' in exceptionResponse) {
                const messages = Array.isArray(exceptionResponse.message) // converts into array
                    ? exceptionResponse.message
                    : [exceptionResponse.message];
                // If it's a validation error array, return the first meaningful message
                // or join them if multiple
                const errorMessage = messages.length === 1
                    ? messages[0]
                    : messages.join(', ');
                response.status(status).json({
                    data: { message: errorMessage },
                });
                return;
            }
            // Fallback to exception message
            response.status(status).json({
                data: { message: exception.message },
            });
            return;
        }
        // Unknown error
        console.error(constants_1.LOG_MESSAGES.UNHANDLED_ERROR, exception);
        response.status(500).json({
            data: { message: constants_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR },
        });
    }
};
exports.AppExceptionFilter = AppExceptionFilter;
exports.AppExceptionFilter = AppExceptionFilter = __decorate([
    (0, common_1.Catch)()
], AppExceptionFilter);
//# sourceMappingURL=httpException.filter.js.map