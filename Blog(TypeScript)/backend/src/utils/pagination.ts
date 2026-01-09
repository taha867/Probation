import type {
  PaginationParams,
  PaginationMeta,
  BaseQuery,
} from "../interfaces/commonInterface.js";


/**
 * Calculates pagination offset from page and limit
 * Joi validation ensures page and limit are always present (defaults applied)
 * This function trusts Joi's validation and does NOT apply defaults
 * 
 * @param params - Validated pagination query parameters (Joi guaranteed defaults)
 * @param params.page - Page number (1-indexed, always present after Joi validation)
 * @param params.limit - Number of items per page (always present after Joi validation)
 * @returns Calculated pagination parameters including offset
 */
export const getPaginationParams = ({
  page,
  limit,
}: BaseQuery & { page: number; limit: number }): PaginationParams => {
  // Joi validation already applied defaults and converted to numbers
  // Trust validation - no need for additional defaults or type checks
  return {
    page,
    limit,
    offset: (page - 1) * limit,
  };
};

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
export const buildPaginationMeta = ({
  total,
  page,
  limit,
}: {
  total: number;
  page: number;
  limit: number;
}): PaginationMeta => {
  return {
    total,
    page,
    limit,
    pagination: Math.ceil(total / limit), // Total number of pages
  };
};

