import { Repository, SelectQueryBuilder, FindManyOptions, ObjectLiteral } from 'typeorm';
import { PaginationMetaDto } from './dto/pagination-meta.dto';
import { PaginatedResultDto } from './dto/paginated-result.dto';
export declare class PaginationService {
    /**
     * Calculate skip (offset) for pagination
     * @param page - Current page number (1-indexed)
     * @param limit - Items per page
     * @returns Skip value for database query
     */
    calculateSkip(page?: number, limit?: number): number;
    /**
     * Paginate using QueryBuilder (for complex queries with joins)
     * @param queryBuilder - TypeORM SelectQueryBuilder instance
     * @param page - Current page number (default: 1)
     * @param limit - Items per page (default: 10)
     * @returns Paginated result with items and metadata
     */
    paginateQueryBuilder<T extends ObjectLiteral>(queryBuilder: SelectQueryBuilder<T>, page?: number, limit?: number): Promise<PaginatedResultDto<T>>;
    /**
     * Paginate using Repository (for simple queries)
     * @param repository - TypeORM Repository instance
     * @param options - FindManyOptions with where, order, relations, etc.
     * @param page - Current page number (default: 1)
     * @param limit - Items per page (default: 10)
     * @returns Paginated result with items and metadata
     */
    paginateRepository<T extends ObjectLiteral>(repository: Repository<T>, options: FindManyOptions<T>, page?: number, limit?: number): Promise<PaginatedResultDto<T>>;
    /**
     * Build pagination metadata DTO
     * @param total - Total number of items
     * @param page - Current page number
     * @param limit - Items per page
     * @returns Pagination metadata DTO instance
     */
    buildMeta(total: number, page: number, limit: number): PaginationMetaDto;
}
//# sourceMappingURL=pagination.service.d.ts.map