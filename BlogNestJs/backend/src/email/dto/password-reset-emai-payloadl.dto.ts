import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../lib/constants';

export class SendPasswordResetEmailDto {
  @IsEmail({}, { message: VALIDATION_MESSAGES.IS_EMAIL })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  resetToken: string;

  @IsString()
  @IsOptional()
  userName?: string;
}
