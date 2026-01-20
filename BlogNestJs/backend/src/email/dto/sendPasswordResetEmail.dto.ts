import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../lib/constants';

/**
 * DTO for sending password reset email input
 */
export class SendPasswordResetEmailDto {
  @IsEmail({}, { message: VALIDATION_MESSAGES.IS_EMAIL })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.IS_REQUIRED })
  email: string;

  @IsString({ message: VALIDATION_MESSAGES.IS_STRING })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.IS_REQUIRED })
  resetToken: string;

  @IsString({ message: VALIDATION_MESSAGES.IS_STRING })
  @IsOptional()
  userName?: string;
}
