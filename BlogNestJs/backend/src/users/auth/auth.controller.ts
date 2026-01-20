import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signUp.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { Public } from './decorators/public.decorator';
import { User } from '../../common/decorators/user.decorator';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../lib/constants';
import { UsePipes } from '@nestjs/common';
import { EmailOrPhonePipe } from './pipes/emailOrPhone.pipe';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.OK)
  async signUp(@Body() signUpDto: SignUpDto) {
    await this.authService.signUp(signUpDto);
    return {
      data: { message: SUCCESS_MESSAGES.ACCOUNT_CREATED },
    };
  }

  @Public()
  @Throttle({ login: { limit: 5, ttl: 60000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(EmailOrPhonePipe)
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async signOut(@User('id') userId: number) {
    await this.authService.logout(userId);
    return {
      data: { message: SUCCESS_MESSAGES.LOGGED_OUT },
    };
  }

  @Public()
  @Post('refreshToken')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Public()
  @Post('forgotPassword')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto.email);
    return {
      data: { message: SUCCESS_MESSAGES.RESET_TOKEN_SENT },
    };
  }

  @Public()
  @Post('resetPassword')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    // Validate passwords match
    if (resetPasswordDto.newPassword !== resetPasswordDto.confirmPassword) {
      throw new BadRequestException(ERROR_MESSAGES.PASSWORD_MISSMATCH);
    }

    await this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
    return {
      data: { message: SUCCESS_MESSAGES.PASSWORD_RESET },
    };
  }
}
