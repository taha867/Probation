import { IsEmail } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../lib/constants';

export class ForgotPasswordDto {
  @IsEmail({}, { message: VALIDATION_MESSAGES.EMAIL_INVALID })
  email: string;
}
