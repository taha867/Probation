import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
  constructor(
    public readonly code: string,
    statusCode: HttpStatus,
    message?: string,
  ) {
    super(message || code, statusCode);
    this.code = code;
  }
}
