import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Base Entity Class
 * Provides common timestamp fields and automatic timestamp management
 */
export abstract class BaseEntity {
  /**
   * Timestamp when entity was created
   * TypeORM automatically sets this on INSERT via @CreateDateColumn
   */
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  /**
   * Timestamp when entity was last updated
   * TypeORM automatically sets this on UPDATE via @UpdateDateColumn
   */
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
