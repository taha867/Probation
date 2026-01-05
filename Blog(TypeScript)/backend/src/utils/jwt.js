import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// Low-level helpers so all JWT usage goes through this file.
// They deliberately keep the same API shape as jsonwebtoken's sign/verify.

export const signToken = (payload, options = {}) => {
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token, options = {}) => {
  return jwt.verify(token, JWT_SECRET, options);
};


