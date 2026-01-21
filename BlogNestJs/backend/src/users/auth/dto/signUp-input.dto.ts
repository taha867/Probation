import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  IsOptional,
  IsUrl,
} from 'class-validator';
import {
  VALIDATION_MESSAGES,
  VALIDATION_PATTERNS,
  VALIDATION_LIMITS,
} from '../../../lib/constants';

export class SignUpDto {
  @IsString()
  @MinLength(VALIDATION_LIMITS.NAME_MIN_LENGTH, {
    message: VALIDATION_MESSAGES.NAME_MIN_LENGTH,
  })
  @Matches(VALIDATION_PATTERNS.NAME, {
    message: VALIDATION_MESSAGES.NAME_INVALID_CHARS,
  })
  name: string;

  @IsEmail({}, { message: VALIDATION_MESSAGES.EMAIL_INVALID })
  email: string;

  @IsString()
  @Matches(VALIDATION_PATTERNS.PHONE, {
    message: VALIDATION_MESSAGES.PHONE_INVALID_FORMAT,
  })
  phone: string;

  @IsString()
  @MinLength(VALIDATION_LIMITS.PASSWORD_MIN_LENGTH, {
    message: VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH,
  })
  password: string;

  @IsOptional()
  @IsUrl({}, { message: VALIDATION_MESSAGES.IMAGE_INVALID_URL })
  image?: string | null;
}
