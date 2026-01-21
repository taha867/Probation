import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VALIDATION_MESSAGES, VALIDATION_PATTERNS } from '../../lib/constants';

export class CreateCommentDto {
  @IsString()
  @MinLength(1, { message: VALIDATION_MESSAGES.COMMENT_BODY_MIN_LENGTH })
  @MaxLength(2000, { message: VALIDATION_MESSAGES.COMMENT_BODY_MAX_LENGTH })
  @Matches(VALIDATION_PATTERNS.NO_HTML_TAGS, {
    message: VALIDATION_MESSAGES.COMMENT_BODY_INVALID_CHARS,
  })
  body: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: VALIDATION_MESSAGES.POST_ID_INVALID })
  postId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: VALIDATION_MESSAGES.PARENT_ID_INVALID })
  parentId?: number;
}
