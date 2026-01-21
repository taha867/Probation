import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import {
  DEFAULTS,
  VALIDATION_LIMITS,
  VALIDATION_MESSAGES,
} from '../../lib/constants';

export class ListUsersQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(VALIDATION_LIMITS.PAGE_MIN, { message: VALIDATION_MESSAGES.PAGE_INVALID })
  page?: number = DEFAULTS.PAGINATION_PAGE;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(VALIDATION_LIMITS.LIMIT_MIN, {
    message: VALIDATION_MESSAGES.LIMIT_MIN_INVALID,
  })
  @Max(VALIDATION_LIMITS.LIMIT_MAX, {
    message: VALIDATION_MESSAGES.LIMIT_MAX_INVALID,
  })
  limit?: number = DEFAULTS.USERS_LIST_LIMIT;
}
