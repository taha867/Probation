import { Repository, DataSource, EntityTarget, FindOptionsWhere, DeepPartial, QueryDeepPartialEntity } from "typeorm";
import { BaseEntity } from "../entities/BaseEntity.js";
export declare abstract class BaseRepository<T extends BaseEntity> {
    protected dataSource: DataSource;
    protected repo: Repository<T>;
    /**
     * Constructor initializes the repository for the given entity
     *
     * @param dataSource - TypeORM DataSource instance
     * @param entity - Entity class (e.g., User, Post, Comment)
     */
    constructor(dataSource: DataSource, entity: EntityTarget<T>);
    /**
     * Find entity by ID
     *
     * @param id - Entity ID to find
     * @returns Entity instance or null if not found
     */
    findById(id: number): Promise<T | null>;
    /**
     * Find entity by ID with specific fields
     *
     * @param id - Entity ID to find
     * @param fields - Array of entity field names to select
     * @returns Entity with only specified fields, or null if not found
     */
    findByIdWithFields(id: number, fields: (keyof T)[]): Promise<T | null>;
    /**
     * Save entity (create or update)
     * @param entity - Entity instance to save
     * @returns Saved entity instance
     */
    save(entity: T): Promise<T>;
    /**
     * Create new entity
     * @param data - Partial entity data (TypeORM's DeepPartial allows nested partials)
     * @returns Created entity instance
     */
    create(data: DeepPartial<T>): Promise<T>;
    /**
     * Delete entity by ID
     *
     * @param id - Entity ID to delete
     */
    delete(id: number): Promise<void>;
    /**
     * @param id - Entity ID to update
     * @param updateData - Partial entity data to update (should include updatedAt)
     *                    Uses QueryDeepPartialEntity for proper TypeORM typing
     */
    update(id: number, updateData: QueryDeepPartialEntity<T>): Promise<void>;
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
    updateEntity(entity: T, updateData: Partial<T>): Promise<T>;
    /**
     * Find entities with pagination
     *
     * @param page - Page number (1-indexed)
     * @param limit - Number of entities per page
     * @param orderBy - Field to order by (defaults to 'createdAt')
     * @param orderDirection - Order direction (defaults to 'DESC')
     * @returns Tuple of [entities, totalCount]
     */
    findPaginated(page: number, limit: number, orderBy?: keyof T, orderDirection?: "ASC" | "DESC"): Promise<[T[], number]>;
    /**
     * Check if entity exists by ID
     *
     * @param id - Entity ID to check
     * @returns True if entity exists, false otherwise
     */
    exists(id: number): Promise<boolean>;
    /**
     * Count entities matching criteria
     *
     * @param where - Find options where clause
     * @returns Number of matching entities
     */
    count(where?: FindOptionsWhere<T>): Promise<number>;
}
//# sourceMappingURL=BaseRepository.d.ts.map