import { HttpException, HttpStatus } from '@nestjs/common';
export declare class AppException extends HttpException {
    readonly code: string;
    constructor(code: string, statusCode: HttpStatus, message?: string);
}
//# sourceMappingURL=app.exception.d.ts.map