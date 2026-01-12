import { Repository, DataSource, Not } from "typeorm";
import { User } from "../entities/User.js";
import type { BaseUserProfile } from "../interfaces/userInterface.js";

/**
 * User Repository
 * Handles all data access operations for User entity
 * Follows Repository Pattern for separation of concerns
 */
export class UserRepository {
  private repo: Repository<User>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(User);
  }

  // ============ Basic CRUD Operations ============

  /**
   * Find user by ID
   */
  async findById(id: number): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  /**
   * Find user by ID with specific fields
   */
  async findByIdWithFields(
    id: number,
    fields: (keyof User)[]
  ): Promise<User | null> {
    const selectObj: any = {};
    fields.forEach((field) => {
      selectObj[field] = true;
    });
    return this.repo.findOne({
      where: { id },
      select: selectObj,
    });
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
        "password",
        "status",
        "image",
        "tokenVersion",
      ],
    });
  }

  /**
   * Check if user exists by email or phone
   */
  async existsByEmailOrPhone(
    email?: string,
    phone?: string
  ): Promise<boolean> {
    if (!email && !phone) return false;

    const where: any[] = [];
    if (email) where.push({ email });
    if (phone) where.push({ phone });

    const count = await this.repo.count({
      where: where.length > 0 ? where : undefined,
    });

    return count > 0;
  }

  /**
   * Check if email exists (excluding specific user)
   */
  async emailExists(email: string, excludeUserId?: number): Promise<boolean> {
    const where: any = { email };
    if (excludeUserId) {
      where.id = Not(excludeUserId);
    }

    const count = await this.repo.count({ where });
    return count > 0;
  }

  /**
   * Check if phone exists (excluding specific user)
   */
  async phoneExists(phone: string, excludeUserId?: number): Promise<boolean> {
    const where: any = { phone };
    if (excludeUserId) {
      where.id = Not(excludeUserId);
    }

    const count = await this.repo.count({ where });
    return count > 0;
  }

  /**
   * Save user (create or update)
   */
  async save(user: User): Promise<User> {
    return this.repo.save(user);
  }

  /**
   * Create new user
   */
  async create(userData: Partial<User>): Promise<User> {
    const user = this.repo.create(userData);
    return this.repo.save(user);
  }

  /**
   * Update user
   */
  async update(id: number, updateData: Partial<User>): Promise<void> {
    await this.repo.update(id, updateData);
  }

  /**
   * Delete user
   */
  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  /**
   * Delete user using QueryBuilder
   */
  async deleteWithQueryBuilder(id: number): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .delete()
      .from(User)
      .where("id = :id", { id })
      .execute();
  }

  // ============ Query Operations ============

  /**
   * Find users with pagination
   */
  async findPaginated(
    page: number,
    limit: number
  ): Promise<[User[], number]> {
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

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    };
  }
}

