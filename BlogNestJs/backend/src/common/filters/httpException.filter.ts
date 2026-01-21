import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ERROR_MESSAGES, LOG_MESSAGES } from '../../lib/constants';
import { AppException } from '../exceptions/app.exception';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof AppException) { // is this our business error
      const status = exception.getStatus();
      const message =
        ERROR_MESSAGES[exception.code as keyof typeof ERROR_MESSAGES] ||
        exception.message;

      response.status(status).json({
        data: { message },
      });
      return;
    }

    if (exception instanceof HttpException) { // http status code eroors
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // Handle ValidationPipe errors (BadRequestException with array of errors)
      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        const messages = Array.isArray(exceptionResponse.message) // converts into array
          ? exceptionResponse.message
          : [exceptionResponse.message];

        // If it's a validation error array, return the first meaningful message
        // or join them if multiple
        const errorMessage =
          messages.length === 1
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
    console.error(LOG_MESSAGES.UNHANDLED_ERROR, exception);
    response.status(500).json({
      data: { message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR },
    });
  }
}
