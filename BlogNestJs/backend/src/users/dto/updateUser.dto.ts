import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  Matches,
} from 'class-validator';
import { VALIDATION_MESSAGES } from '../../lib/constants';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @Matches(/^[A-Za-z\s]+$/, {
    message: VALIDATION_MESSAGES.NAME_INVALID_CHARS,
  })
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9]{10,15}$/, {
    message: VALIDATION_MESSAGES.PHONE_INVALID_FORMAT,
  })
  phone?: string | null;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @IsOptional()
  image?: string | null;
}
