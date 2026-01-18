import { DataSource } from "typeorm";
import { User } from "../entities/User.js";
import type { BaseUserProfile } from "../interfaces/userInterface.js";
import { BaseRepository } from "./BaseRepository.js";
/**
 * User Repository
 * Handles all data access operations for User entity
 * Extends BaseRepository for common CRUD operations
 */
export declare class UserRepository extends BaseRepository<User> {
    constructor(dataSource: DataSource);
    /**
     * Find user by email
     */
    findByEmail(email: string): Promise<User | null>;
    /**
     * Find user by phone
     */
    findByPhone(phone: string): Promise<User | null>;
    /**
     * Find user by email or phone (for authentication)
     */
    findByEmailOrPhone(email?: string, phone?: string): Promise<User | null>;
    /**
     * Check if user exists by email or phone
     */
    existsByEmailOrPhone(email?: string, phone?: string): Promise<boolean>;
    /**
     * Check if email exists (excluding specific user)
     */
    emailExists(email: string, excludeUserId?: number): Promise<boolean>;
    /**
     * Check if phone exists (excluding specific user)
     */
    phoneExists(phone: string, excludeUserId?: number): Promise<boolean>;
    /**
     * Update user using repository.update() for performance
     * Overrides base method to manually set updatedAt
     *
     * @param id - User ID to update
     * @param updateData - Partial user data to update
     * @returns Promise that resolves when update completes
     */
    update(id: number, updateData: Partial<User>): Promise<void>;
    /**
     * Find users with pagination
     * Overrides base method to include specific field selection
     */
    findPaginated(page: number, limit: number): Promise<[User[], number]>;
    /**
     * Find user with public profile fields only
     */
    findPublicProfile(id: number): Promise<BaseUserProfile | null>;
}
//# sourceMappingURL=UserRepository.d.ts.map