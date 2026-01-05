// Assumes page/limit are already validated and defaulted by Joi.
// Simply calculates offset from the provided values.
export const getPaginationParams = ({ page, limit }) => ({
  page,
  limit,
  offset: (page - 1) * limit,
});

// Builds a standard pagination meta object.
export const buildPaginationMeta = ({ total, page, limit }) => ({
  total,
  page,
  limit,
  pagination: Math.ceil(total / limit),
});


