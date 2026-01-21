import { IsInt, Min } from 'class-validator';

export class PaginationMetaDto {
  @IsInt()
  @Min(0)
  total: number;

  @IsInt()
  @Min(1)
  page: number;

  @IsInt()
  @Min(1)
  limit: number;

  @IsInt()
  @Min(0)
  pagination: number; // Total number of pages
}
