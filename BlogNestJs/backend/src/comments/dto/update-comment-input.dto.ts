import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { VALIDATION_MESSAGES, VALIDATION_PATTERNS } from '../../lib/constants';

export class UpdateCommentDto {
  @IsString()
  @MinLength(1, { message: VALIDATION_MESSAGES.COMMENT_BODY_MIN_LENGTH })
  @MaxLength(2000, { message: VALIDATION_MESSAGES.COMMENT_BODY_MAX_LENGTH })
  @Matches(VALIDATION_PATTERNS.NO_HTML_TAGS, {
    message: VALIDATION_MESSAGES.COMMENT_BODY_INVALID_CHARS,
  })
  body: string;
}
