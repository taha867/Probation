/**
 * Hash a plain text password using bcrypt
 * @param plainPassword - The plain text password to hash
 * @returns Promise that resolves to the hashed password string
 */
export declare const hashPassword: (plainPassword: string) => Promise<string>;
/**
 * Compare a plain text password with a hashed password
 * @param plainPassword - The plain text password to compare
 * @param hashedPassword - The hashed password to compare against
 * @returns Promise that resolves to true if passwords match, false otherwise
 */
export declare const comparePassword: (plainPassword: string, hashedPassword: string) => Promise<boolean>;
//# sourceMappingURL=bcrypt.d.ts.map