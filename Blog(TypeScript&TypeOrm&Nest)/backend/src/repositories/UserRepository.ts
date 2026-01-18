import { DataSource, Not, FindOptionsWhere } from "typeorm";
import { User } from "../entities/User.js";
import type { BaseUserProfile } from "../interfaces/userInterface.js";
import { BaseRepository } from "./BaseRepository.js";

/**
 * User Repository
 * Handles all data access operations for User entity
 * Extends BaseRepository for common CRUD operations
 */
export class UserRepository extends BaseRepository<User> {
  constructor(dataSource: DataSource) {
    super(dataSource, User);
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  /**
   * Find user by phone
   */
  async findByPhone(phone: string): Promise<User | null> {
    return this.repo.findOne({ where: { phone } });
  }

  /**
   * Find user by email or phone (for authentication)
   */
  async findByEmailOrPhone(
    email?: string,
    phone?: string
  ): Promise<User | null> {
    if (!email && !phone) return null;

    return this.repo.findOne({
      where: email ? { email } : { phone },
      select: [
        "id",
        "name",
        "email",
        "phone",
        "password", // password has select: false in the entity, Must explicitly select it when needed
        "status",
        "image",
        "tokenVersion",
      ],
    });
  }

  /**
   * Check if user exists by email or phone
   */
  async existsByEmailOrPhone(email?: string, phone?: string): Promise<boolean> {
    const where: FindOptionsWhere<User>[] = []; // only properties that exist on User are allowed

    if (email) where.push({ email });
    if (phone) where.push({ phone });

    if (where.length === 0) return false;

    return this.repo.exists({ where });
  }

  /**
   * Check if email exists (excluding specific user)
   */
  async emailExists(email: string, excludeUserId?: number): Promise<boolean> {
    const where: FindOptionsWhere<User> = excludeUserId
      ? { email, id: Not(excludeUserId) }
      : { email };

    const count = await this.repo.count({ where });
    return count > 0;
  }

  /**
   * Check if phone exists (excluding specific user)
   */
  async phoneExists(phone: string, excludeUserId?: number): Promise<boolean> {
    const where: FindOptionsWhere<User> = excludeUserId
      ? { phone, id: Not(excludeUserId) }
      : { phone };

    const count = await this.repo.count({ where });
    return count > 0;
  }

  /**
   * Update user using repository.update() for performance
   * Overrides base method to manually set updatedAt
   * 
   * @param id - User ID to update
   * @param updateData - Partial user data to update
   * @returns Promise that resolves when update completes
   */
  async update(id: number, updateData: Partial<User>): Promise<void> {
    // Manually set updatedAt since repository.update() bypasses @UpdateDateColumn
    const dataWithTimestamp = {
      ...updateData,
      updatedAt: new Date(),
    };
    await this.repo.update(id, dataWithTimestamp);
  }

  /**
   * Find users with pagination
   * Overrides base method to include specific field selection
   */
  async findPaginated(page: number, limit: number): Promise<[User[], number]> {
    const offset = (page - 1) * limit;

    return this.repo.findAndCount({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        image: true,
      },
      order: { createdAt: "DESC" },
      take: limit,
      skip: offset,
    });
  }

  /**
   * Find user with public profile fields only
   */
  async findPublicProfile(id: number): Promise<BaseUserProfile | null> {
    const user = await this.repo.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    if (!user) return null;
    const { name, email, image } = user;

    return {
      id: user.id,
      name,
      email,
      image,
    };
  }
}
