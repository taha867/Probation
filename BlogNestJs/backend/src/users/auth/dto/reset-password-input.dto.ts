import { IsString, MinLength } from 'class-validator';
import { VALIDATION_MESSAGES, VALIDATION_LIMITS } from '../../../lib/constants';

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(VALIDATION_LIMITS.PASSWORD_MIN_LENGTH, {
    message: VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH,
  })
  newPassword: string;

  @IsString()
  @MinLength(VALIDATION_LIMITS.PASSWORD_MIN_LENGTH, {
    message: VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH,
  })
  confirmPassword: string;
}
