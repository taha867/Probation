import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  Matches,
  IsUrl,
  ValidateIf,
} from 'class-validator';
import {
  VALIDATION_MESSAGES,
  VALIDATION_PATTERNS,
  VALIDATION_LIMITS,
} from '../../lib/constants';


export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(VALIDATION_LIMITS.NAME_MIN_LENGTH, {
    message: VALIDATION_MESSAGES.NAME_MIN_LENGTH,
  })
  @Matches(VALIDATION_PATTERNS.NAME, {
    message: VALIDATION_MESSAGES.NAME_INVALID_CHARS,
  })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: VALIDATION_MESSAGES.EMAIL_INVALID })
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(VALIDATION_PATTERNS.PHONE, {
    message: VALIDATION_MESSAGES.PHONE_INVALID_FORMAT,
  })
  phone?: string | null;

  @IsOptional()
  @IsString()
  @MinLength(VALIDATION_LIMITS.PASSWORD_MIN_LENGTH, {
    message: VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH,
  })
  password?: string;

  @IsOptional()
  @ValidateIf((o) => o.image !== "")
  @IsUrl({}, { message: VALIDATION_MESSAGES.IMAGE_INVALID_URL })
  image?: string | null;
}
