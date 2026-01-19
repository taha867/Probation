"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppException = void 0;
const common_1 = require("@nestjs/common");
class AppException extends common_1.HttpException {
    constructor(code, statusCode, message) {
        super(message || code, statusCode);
        this.code = code;
        this.code = code;
    }
}
exports.AppException = AppException;
//# sourceMappingURL=app.exception.js.map