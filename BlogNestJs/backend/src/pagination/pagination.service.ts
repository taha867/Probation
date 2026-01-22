import { Injectable } from '@nestjs/common';
import {
  Repository,
  SelectQueryBuilder,
  FindManyOptions,
  ObjectLiteral, // any databse entity object 
} from 'typeorm';
import { PaginationMetaDto } from './dto/pagination-meta.dto';
import { PaginatedResultDto } from './dto/paginated-result.dto';
import { DEFAULTS } from '../lib/constants';

@Injectable()
export class PaginationService {
  /**
   * Calculate skip (offset) for pagination
   * @param page - Current page number (1-indexed)
   * @param limit - Items per page
   * @returns Skip value for database query
   */
  calculateSkip(
    page: number = DEFAULTS.PAGINATION_PAGE,
    limit: number = DEFAULTS.PAGINATION_LIMIT,
  ): number {
    return (page - 1) * limit;
  }

  /**
   * Paginate using QueryBuilder (for complex queries with joins)
   * @param queryBuilder - TypeORM SelectQueryBuilder instance
   * @param page - Current page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @returns Paginated result with items and metadata
   */
  async paginateQueryBuilder<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    page: number = DEFAULTS.PAGINATION_PAGE,
    limit: number = DEFAULTS.PAGINATION_LIMIT,
  ): Promise<PaginatedResultDto<T>> {
    const skip = this.calculateSkip(page, limit);
    
    //cureent page data and total records in db 
    const [items, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const paginationOptions = this.buildMeta(total, page, limit);

    return {
      data: {
        items,
        paginationOptions,
      },
    };
  }

  /**
   * Paginate using Repository (for simple queries)
   * @param repository - TypeORM Repository instance
   * @param options - FindManyOptions with where, order, relations, etc.
   * @param page - Current page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @returns Paginated result with items and metadata
   */
  async paginateRepository<T extends ObjectLiteral>(
    repository: Repository<T>,
    options: FindManyOptions<T>,
    page: number = DEFAULTS.PAGINATION_PAGE,
    limit: number = DEFAULTS.PAGINATION_LIMIT,
  ): Promise<PaginatedResultDto<T>> {
    const skip = this.calculateSkip(page, limit);

    const [items, total] = await repository.findAndCount({
      ...options,
      skip,
      take: limit,
    });

    const paginationOptions = this.buildMeta(total, page, limit);

    return {
      data: {
        items,
        paginationOptions,
      },
    };
  }

  /**
   * Build pagination metadata DTO
   * @param total - Total number of items
   * @param page - Current page number
   * @param limit - Items per page
   * @returns Pagination metadata DTO instance
   */
  buildMeta(total: number, page: number, limit: number): PaginationMetaDto {
    const meta = new PaginationMetaDto();
    meta.total = total;
    meta.page = page;
    meta.limit = limit;
    meta.pagination = Math.ceil(total / limit); // Total number of pages
    return meta;
  }
}
