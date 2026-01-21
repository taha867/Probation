import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  ValidateIf,
  Matches,
} from 'class-validator';
import {
  VALIDATION_LIMITS,
  VALIDATION_MESSAGES,
  VALIDATION_PATTERNS,
} from '../../../lib/constants';

export class SignInDto {
  @IsEmail({}, { message: VALIDATION_MESSAGES.EMAIL_INVALID })
  @IsOptional()
  @ValidateIf((o) => !o.phone)
  email?: string;

  @IsString()
  @IsOptional()
  @ValidateIf((o) => !o.email)
  @Matches(VALIDATION_PATTERNS.PHONE, {
    message: VALIDATION_MESSAGES.PHONE_INVALID_FORMAT,
  })
  phone?: string;

  @IsString()
  @MinLength(VALIDATION_LIMITS.PASSWORD_MIN_LENGTH, {
    message: VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH,
  })
  password: string;
}
