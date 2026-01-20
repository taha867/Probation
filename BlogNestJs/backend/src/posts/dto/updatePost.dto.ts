import {
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { PostStatus } from '../post.entity';
import { VALIDATION_MESSAGES } from '../../lib/constants';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @Matches(/^[^<>]*$/, {
    message: VALIDATION_MESSAGES.TITLE_INVALID_CHARS,
  })
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  @Matches(/^[^<>]*$/, {
    message: VALIDATION_MESSAGES.BODY_INVALID_CHARS,
  })
  body?: string;

  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @IsOptional()
  @IsString()
  image?: string | null;
}
