import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ERROR_MESSAGES } from '../../shared/constants/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
 
    if (!token) {
      throw new UnauthorizedException(ERROR_MESSAGES.ACCESS_TOKEN_REQUIRED);
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      if (payload.type !== 'access') {
        throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
      }

      request.user = { id: payload.userId };
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        throw new UnauthorizedException(ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED);
      }
      if (error instanceof Error && error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
      }
      throw new UnauthorizedException(ERROR_MESSAGES.AUTHENTICATION_FAILED);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

