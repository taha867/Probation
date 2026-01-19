import { MigrationInterface, QueryRunner } from "typeorm";
/**
 * Migration: Remove database defaults for createdAt and updatedAt
 *
 * Best Practice: TypeORM's @CreateDateColumn and @UpdateDateColumn decorators
 * handle timestamps in the application layer. Database defaults should be removed
 * to avoid conflicts and follow single responsibility principle.
 *
 * This migration removes defaults from:
 * - Users.createdAt, Users.updatedAt
 * - Posts.createdAt, Posts.updatedAt
 * - Comments.createdAt, Comments.updatedAt
 */
export declare class RemoveTimestampDefaults1768772111000 implements MigrationInterface {
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
//# sourceMappingURL=1768772111000-RemoveTimestampDefaults.d.ts.map