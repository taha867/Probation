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
import { VALIDATION_MESSAGES } from '../../lib/constants';

export class CreateCommentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  @Matches(/^[^<>]*$/, {
    message: VALIDATION_MESSAGES.COMMENT_BODY_INVALID_CHARS,
  })
  body: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  postId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  parentId?: number;
}
