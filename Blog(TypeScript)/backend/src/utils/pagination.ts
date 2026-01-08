import type {
  PaginationParams,
  PaginationMeta,
} from "../interfaces/commonInterface.js";
import type { ListUsersQuery } from "../interfaces/userInterface.js";

/**
 * Pagination utility functions
 * Helper functions for calculating pagination parameters and metadata
 */

/**
 * Calculates pagination offset from page and limit
 * Assumes page/limit are already validated and defaulted by Joi
 * 
 * @param params - Pagination query parameters
 * @param params.page - Page number (1-indexed)
 * @param params.limit - Number of items per page
 * @returns Calculated pagination parameters including offset
 */
export const getPaginationParams = ({
  page = 1,
  limit = 20,
}: ListUsersQuery = {}): PaginationParams => {
  // Ensure page and limit are numbers (Joi validation should have converted them)
  const pageNum = typeof page === "number" ? page : 1;
  const limitNum = typeof limit === "number" ? limit : 20;

  return {
    page: pageNum,
    limit: limitNum,
    offset: (pageNum - 1) * limitNum,
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

