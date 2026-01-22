import {
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { PostStatus } from '../post-entity/post.entity';
import { VALIDATION_MESSAGES, VALIDATION_PATTERNS } from '../../lib/constants';

export class CreatePostDto {
  @IsString()
  @MinLength(1, { message: VALIDATION_MESSAGES.TITLE_MIN_LENGTH })
  @MaxLength(200, { message: VALIDATION_MESSAGES.TITLE_MAX_LENGTH })
  @Matches(VALIDATION_PATTERNS.NO_HTML_TAGS, {
    message: VALIDATION_MESSAGES.TITLE_INVALID_CHARS,
  })
  title: string;

  @IsString()
  @MinLength(1, { message: VALIDATION_MESSAGES.BODY_MIN_LENGTH })
  @Matches(VALIDATION_PATTERNS.NO_HTML_TAGS, {
    message: VALIDATION_MESSAGES.BODY_INVALID_CHARS,
  })
  body: string;

  @IsOptional()
  @IsEnum(PostStatus, { message: VALIDATION_MESSAGES.STATUS_INVALID })
  status?: PostStatus = PostStatus.DRAFT;
}
