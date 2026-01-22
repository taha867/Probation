import { PaginationMetaDto } from './pagination-meta.dto';

export class PaginatedResultDto<T> {
  data: {
    items: T[];
    paginationOptions: PaginationMetaDto;
  };
}
