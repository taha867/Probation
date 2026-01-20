import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Base Entity Class
 * Provides common timestamp fields and automatic timestamp management
 */
export abstract class BaseEntity {
  /**
   * Timestamp when entity was created
   * TypeORM automatically sets this on INSERT via @CreateDateColumn
   * Explicit type 'timestamp' needed: TypeORM can't infer timestamp from Date
   */
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  /**
   * Timestamp when entity was last updated
   * TypeORM automatically sets this on UPDATE via @UpdateDateColumn
   * Explicit type 'timestamp' needed: TypeORM can't infer timestamp from Date
   */
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
