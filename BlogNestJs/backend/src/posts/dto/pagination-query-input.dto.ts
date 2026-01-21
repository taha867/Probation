import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { VALIDATION_MESSAGES, VALIDATION_LIMITS } from '../../lib/constants';

export class PaginationQueryDto {
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
}
