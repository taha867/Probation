import * as bcrypt from "bcrypt";

const SALT_ROUNDS: number = 10;

/**
 * Hash a plain text password using bcrypt
 * @param plainPassword - The plain text password to hash
 * @returns Promise that resolves to the hashed password string
 */
export const hashPassword = async (plainPassword: string): Promise<string> => {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
};

/**
 * Compare a plain text password with a hashed password
 * @param plainPassword - The plain text password to compare
 * @param hashedPassword - The hashed password to compare against
 * @returns Promise that resolves to true if passwords match, false otherwise
 */
export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

