

/**
 * @param {Object} params - Query parameters object
 * @returns {URLSearchParams} Cleaned URLSearchParams object ready for URL building

 */
export const buildQueryString = (params = {}) => {
  // Filter out undefined, null, and empty string values
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => 
      value !== undefined && value !== null && value !== ""
    )
  );
  
  // Convert to URLSearchParams
  return new URLSearchParams(cleanParams);
};

