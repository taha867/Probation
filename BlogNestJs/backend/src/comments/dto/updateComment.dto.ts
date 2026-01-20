import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../lib/constants';

export class UpdateCommentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  @Matches(/^[^<>]*$/, {
    message: VALIDATION_MESSAGES.COMMENT_BODY_INVALID_CHARS,
  })
  body: string;
}
