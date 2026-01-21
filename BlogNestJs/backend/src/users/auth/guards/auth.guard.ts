import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../../../customDecorators/public.decorator';
import { ERROR_MESSAGES } from '../../../lib/constants';

const {
  INVALID_TOKEN,
  ACCESS_TOKEN_REQUIRED,
  ACCESS_TOKEN_EXPIRED,
  AUTHENTICATION_FAILED,
} = ERROR_MESSAGES;

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector, // reads metadata set by decorators
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), // Get the handler (e.g: signIn method)
      context.getClass(), // Get the class (e.g: AuthController)
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(ACCESS_TOKEN_REQUIRED);
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      if (payload.type !== 'access') {
        throw new UnauthorizedException(INVALID_TOKEN);
      }

      request.user = { id: payload.userId };
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        throw new UnauthorizedException(ACCESS_TOKEN_EXPIRED);
      }
      if (error instanceof Error && error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException(INVALID_TOKEN);
      }
      throw new UnauthorizedException(AUTHENTICATION_FAILED);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
