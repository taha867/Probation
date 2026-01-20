import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../lib/constants';

export class SignUpDto {
  @IsString()
  @MinLength(2)
  @Matches(/^[A-Za-z\s]+$/, {
    message: VALIDATION_MESSAGES.NAME_INVALID_CHARS,
  })
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^\+?[0-9]{10,15}$/, {
    message: VALIDATION_MESSAGES.PHONE_INVALID_FORMAT,
  })
  phone: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsUrl()
  image?: string | null;
}
