import type { PaginationMeta } from "../interfaces/commonInterface.js";
/**
 * Builds standard pagination metadata object
 * Creates pagination response metadata for API responses
 *
 * @param params - Pagination result parameters
 * @param params.total - Total number of items
 * @param params.page - Current page number
 * @param params.limit - Items per page
 * @returns Pagination metadata object
 */
export declare const buildPaginationMeta: ({ total, page, limit, }: {
    total: number;
    page: number;
    limit: number;
}) => PaginationMeta;
//# sourceMappingURL=pagination.d.ts.map