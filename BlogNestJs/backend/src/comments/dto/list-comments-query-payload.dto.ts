import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { VALIDATION_MESSAGES } from '../../lib/constants';

export class ListCommentsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: VALIDATION_MESSAGES.POST_ID_INVALID })
  postId?: number;
}
