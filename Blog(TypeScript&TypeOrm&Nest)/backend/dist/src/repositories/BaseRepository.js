export class BaseRepository {
    /**
     * Constructor initializes the repository for the given entity
     *
     * @param dataSource - TypeORM DataSource instance
     * @param entity - Entity class (e.g., User, Post, Comment)
     */
    constructor(dataSource, entity) {
        this.dataSource = dataSource;
        this.repo = dataSource.getRepository(entity);
    }
    /**
     * Find entity by ID
     *
     * @param id - Entity ID to find
     * @returns Entity instance or null if not found
     */
    async findById(id) {
        return this.repo.findOne({ where: { id } });
    }
    /**
     * Find entity by ID with specific fields
     *
     * @param id - Entity ID to find
     * @param fields - Array of entity field names to select
     * @returns Entity with only specified fields, or null if not found
     */
    async findByIdWithFields(id, fields) {
        return this.repo.findOne({
            where: { id },
            select: fields,
        });
    }
    /**
     * Save entity (create or update)
     * @param entity - Entity instance to save
     * @returns Saved entity instance
     */
    async save(entity) {
        return this.repo.save(entity);
    }
    /**
     * Create new entity
     * @param data - Partial entity data (TypeORM's DeepPartial allows nested partials)
     * @returns Created entity instance
     */
    async create(data) {
        const entity = this.repo.create(data);
        return this.repo.save(entity);
    }
    /**
     * Delete entity by ID
     *
     * @param id - Entity ID to delete
     */
    async delete(id) {
        await this.repo.delete(id);
    }
    /**
     * @param id - Entity ID to update
     * @param updateData - Partial entity data to update (should include updatedAt)
     *                    Uses QueryDeepPartialEntity for proper TypeORM typing
     */
    async update(id, updateData) {
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
    async updateEntity(entity, updateData) {
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
    async findPaginated(page, limit, orderBy = "createdAt", orderDirection = "DESC") {
        const offset = (page - 1) * limit;
        // Build type-safe order object using TypeORM's FindOptionsOrder type
        const order = {
            [orderBy]: orderDirection,
        };
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
    async exists(id) {
        return this.repo.exists({ where: { id } });
    }
    /**
     * Count entities matching criteria
     *
     * @param where - Find options where clause
     * @returns Number of matching entities
     */
    async count(where) {
        return this.repo.count({ where });
    }
}
//# sourceMappingURL=BaseRepository.js.map