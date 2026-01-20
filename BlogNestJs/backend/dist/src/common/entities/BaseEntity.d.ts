/**
 * Base Entity Class
 * Provides common timestamp fields and automatic timestamp management
 */
export declare abstract class BaseEntity {
    /**
     * Timestamp when entity was created
     * TypeORM automatically sets this on INSERT via @CreateDateColumn
     */
    createdAt: Date;
    /**
     * Timestamp when entity was last updated
     * TypeORM automatically sets this on UPDATE via @UpdateDateColumn
     */
    updatedAt: Date;
}
//# sourceMappingURL=BaseEntity.d.ts.map