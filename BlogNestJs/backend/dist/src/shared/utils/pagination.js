"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPaginationMeta = void 0;
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
const buildPaginationMeta = ({ total, page, limit, }) => {
    return {
        total,
        page,
        limit,
        pagination: Math.ceil(total / limit), // Total number of pages
    };
};
exports.buildPaginationMeta = buildPaginationMeta;
//# sourceMappingURL=pagination.js.map