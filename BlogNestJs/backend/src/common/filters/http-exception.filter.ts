import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ERROR_MESSAGES } from '../../shared/constants/constants';
import { AppException } from '../exceptions/app.exception';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof AppException) {
      const status = exception.getStatus();
      const message =
        ERROR_MESSAGES[exception.code as keyof typeof ERROR_MESSAGES] ||
        exception.message;

      response.status(status).json({
        data: { message },
      });
      return;
    }

    if (exception instanceof HttpException) {
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
}

