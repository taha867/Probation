import { IsOptional, IsInt, Min, Max, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { PostStatus } from '../post.entity';
import { VALIDATION_MESSAGES, VALIDATION_LIMITS } from '../../lib/constants';

export class ListPostsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(VALIDATION_LIMITS.PAGE_MIN, { message: VALIDATION_MESSAGES.PAGE_INVALID })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(VALIDATION_LIMITS.LIMIT_MIN, {
    message: VALIDATION_MESSAGES.LIMIT_MIN_INVALID,
  })
  @Max(VALIDATION_LIMITS.LIMIT_MAX, {
    message: VALIDATION_MESSAGES.LIMIT_MAX_INVALID,
  })
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'User ID must be a positive integer' })
  userId?: number;

  @IsOptional()
  @IsEnum(PostStatus, { message: VALIDATION_MESSAGES.STATUS_INVALID })
  status?: PostStatus;
}
