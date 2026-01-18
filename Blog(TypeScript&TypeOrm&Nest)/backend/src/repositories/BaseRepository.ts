import {
  Repository,
  DataSource,
  EntityTarget,
  FindOptionsWhere,
  FindOptionsOrder,
  DeepPartial,
  QueryDeepPartialEntity,
} from "typeorm";
import { BaseEntity } from "../entities/BaseEntity.js";


export abstract class BaseRepository<T extends BaseEntity> {
  protected repo: Repository<T>;

  /**
   * Constructor initializes the repository for the given entity
   * 
   * @param dataSource - TypeORM DataSource instance
   * @param entity - Entity class (e.g., User, Post, Comment)
   */
  constructor(
    protected dataSource: DataSource,
    entity: EntityTarget<T>
  ) {
    this.repo = dataSource.getRepository(entity);
  }

  /**
   * Find entity by ID
   * 
   * @param id - Entity ID to find
   * @returns Entity instance or null if not found
   */
  async findById(id: number): Promise<T | null> {
    return this.repo.findOne({ where: { id } as unknown as FindOptionsWhere<T> });
  }

  /**
   * Find entity by ID with specific fields
   * 
   * @param id - Entity ID to find
   * @param fields - Array of entity field names to select
   * @returns Entity with only specified fields, or null if not found
   */
  async findByIdWithFields(
    id: number,
    fields: (keyof T)[]
  ): Promise<T | null> {
    return this.repo.findOne({
      where: { id } as unknown as FindOptionsWhere<T>,
      select: fields as (keyof T)[],
    });
  }

  /**
   * Save entity (create or update)
   * @param entity - Entity instance to save
   * @returns Saved entity instance
   */
  async save(entity: T): Promise<T> {
    return this.repo.save(entity);
  }

  /**
   * Create new entity
   * @param data - Partial entity data (TypeORM's DeepPartial allows nested partials)
   * @returns Created entity instance with timestamps set
   */
  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repo.create(data);
    
    // Explicitly set timestamps to ensure they're included in INSERT SQL
    // TypeORM decorators would set these during save(), but SQL generation happens first
    const now = new Date();
    (entity as any).createdAt = now;
    (entity as any).updatedAt = now;
    
    // Save entity - TypeORM will use the explicitly set values instead of DEFAULT
    return this.repo.save(entity);
  }

  /**
   * Delete entity by ID
   * 
   * @param id - Entity ID to delete
   */
  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  /**
   * @param id - Entity ID to update
   * @param updateData - Partial entity data to update (should include updatedAt)
   *                    Uses QueryDeepPartialEntity for proper TypeORM typing
   */
  async update(id: number, updateData: QueryDeepPartialEntity<T>): Promise<void> {
    await this.repo.update(id, updateData);
  }

  /**
   * Update entity using save() method
   * Triggers lifecycle hooks (@BeforeUpdate, @AfterUpdate)
   * Automatically updates @UpdateDateColumn
   * 
   * Industry best practice: Use this for single entity updates
   * when you need hooks and automatic timestamp management
   * 
   * @param entity - Entity instance to update
   * @param updateData - Partial entity data to update
   * @returns Updated entity instance
   */
  async updateEntity(entity: T, updateData: Partial<T>): Promise<T> {
    Object.assign(entity, updateData);
    return this.repo.save(entity);
  }

  /**
   * Find entities with pagination
   * 
   * @param page - Page number (1-indexed)
   * @param limit - Number of entities per page
   * @param orderBy - Field to order by (defaults to 'createdAt')
   * @param orderDirection - Order direction (defaults to 'DESC')
   * @returns Tuple of [entities, totalCount]
   */
  async findPaginated(
    page: number,
    limit: number,
    orderBy: keyof T = "createdAt" as keyof T,
    orderDirection: "ASC" | "DESC" = "DESC"
  ): Promise<[T[], number]> {
    const offset = (page - 1) * limit;

    // Build type-safe order object using TypeORM's FindOptionsOrder type
    const order: FindOptionsOrder<T> = {
      [orderBy]: orderDirection,
    } as FindOptionsOrder<T>;

    return this.repo.findAndCount({
      order,
      take: limit,
      skip: offset,
    });
  }

  /**
   * Check if entity exists by ID
   * 
   * @param id - Entity ID to check
   * @returns True if entity exists, false otherwise
   */
  async exists(id: number): Promise<boolean> {
    return this.repo.exists({ where: { id } as unknown as FindOptionsWhere<T> });
  }

  /**
   * Count entities matching criteria
   * 
   * @param where - Find options where clause
   * @returns Number of matching entities
   */
  async count(where?: FindOptionsWhere<T>): Promise<number> {
    return this.repo.count({ where });
  }
}

