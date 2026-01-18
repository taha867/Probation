import {
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";

/**
 * Base Entity Class
 * Provides common timestamp fields and automatic timestamp management
 */
export abstract class BaseEntity {
  /**
   * Timestamp when entity was created
   * TypeORM automatically sets this on INSERT via @CreateDateColumn
   */
  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  /**
   * Timestamp when entity was last updated
   * TypeORM automatically sets this on UPDATE via @UpdateDateColumn
   */
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;

  /**
   * Entity Listener: Before Insert
   * Safety net to ensure createdAt and updatedAt are set even if decorators fail
   * Only sets if not already set (allows manual override if needed)
   */
  @BeforeInsert()
  setTimestampsOnInsert(): void {
    const now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    if (!this.updatedAt) {
      this.updatedAt = now;
    }
  }

  /**
   * Entity Listener: Before Update
   * Safety net to ensure updatedAt is set even if decorator fails
   * Always updates updatedAt on any update operation
   */
  @BeforeUpdate()
  setTimestampOnUpdate(): void {
    this.updatedAt = new Date();
  }
}

