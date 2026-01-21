import {
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { PostStatus } from '../post.entity';
import { VALIDATION_MESSAGES, VALIDATION_PATTERNS } from '../../lib/constants';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: VALIDATION_MESSAGES.TITLE_MIN_LENGTH })
  @MaxLength(200, { message: VALIDATION_MESSAGES.TITLE_MAX_LENGTH })
  @Matches(VALIDATION_PATTERNS.NO_HTML_TAGS, {
    message: VALIDATION_MESSAGES.TITLE_INVALID_CHARS,
  })
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(1, { message: VALIDATION_MESSAGES.BODY_MIN_LENGTH })
  @MaxLength(5000, { message: 'Post body must not exceed 5000 characters' })
  @Matches(VALIDATION_PATTERNS.NO_HTML_TAGS, {
    message: VALIDATION_MESSAGES.BODY_INVALID_CHARS,
  })
  body?: string;

  @IsOptional()
  @IsEnum(PostStatus, { message: VALIDATION_MESSAGES.STATUS_INVALID })
  status?: PostStatus;

  @IsOptional()
  @IsString()
  image?: string | null;
}
