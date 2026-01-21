"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationService = void 0;
const common_1 = require("@nestjs/common");
const pagination_meta_dto_1 = require("./dto/pagination-meta.dto");
const constants_1 = require("../lib/constants");
let PaginationService = class PaginationService {
    /**
     * Calculate skip (offset) for pagination
     * @param page - Current page number (1-indexed)
     * @param limit - Items per page
     * @returns Skip value for database query
     */
    calculateSkip(page = constants_1.DEFAULTS.PAGINATION_PAGE, limit = constants_1.DEFAULTS.PAGINATION_LIMIT) {
        return (page - 1) * limit;
    }
    /**
     * Paginate using QueryBuilder (for complex queries with joins)
     * @param queryBuilder - TypeORM SelectQueryBuilder instance
     * @param page - Current page number (default: 1)
     * @param limit - Items per page (default: 10)
     * @returns Paginated result with items and metadata
     */
    async paginateQueryBuilder(queryBuilder, page = constants_1.DEFAULTS.PAGINATION_PAGE, limit = constants_1.DEFAULTS.PAGINATION_LIMIT) {
        const skip = this.calculateSkip(page, limit);
        //cureent page data and total records in db 
        const [items, total] = await queryBuilder
            .skip(skip)
            .take(limit)
            .getManyAndCount();
        const meta = this.buildMeta(total, page, limit);
        return {
            data: {
                items,
                meta,
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
    async paginateRepository(repository, options, page = constants_1.DEFAULTS.PAGINATION_PAGE, limit = constants_1.DEFAULTS.PAGINATION_LIMIT) {
        const skip = this.calculateSkip(page, limit);
        const [items, total] = await repository.findAndCount({
            ...options,
            skip,
            take: limit,
        });
        const meta = this.buildMeta(total, page, limit);
        return {
            data: {
                items,
                meta,
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
    buildMeta(total, page, limit) {
        const meta = new pagination_meta_dto_1.PaginationMetaDto();
        meta.total = total;
        meta.page = page;
        meta.limit = limit;
        meta.pagination = Math.ceil(total / limit); // Total number of pages
        return meta;
    }
};
exports.PaginationService = PaginationService;
exports.PaginationService = PaginationService = __decorate([
    (0, common_1.Injectable)()
], PaginationService);
//# sourceMappingURL=pagination.service.js.map