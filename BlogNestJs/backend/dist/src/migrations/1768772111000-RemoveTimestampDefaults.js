"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveTimestampDefaults1768772111000 = void 0;
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
class RemoveTimestampDefaults1768772111000 {
    async up(queryRunner) {
        // Remove defaults from Users table
        await queryRunner.query(`
      ALTER TABLE "Users" 
      ALTER COLUMN "createdAt" DROP DEFAULT,
      ALTER COLUMN "updatedAt" DROP DEFAULT;
    `);
        // Remove defaults from Posts table
        await queryRunner.query(`
      ALTER TABLE "Posts" 
      ALTER COLUMN "createdAt" DROP DEFAULT,
      ALTER COLUMN "updatedAt" DROP DEFAULT;
    `);
        // Remove defaults from Comments table
        await queryRunner.query(`
      ALTER TABLE "Comments" 
      ALTER COLUMN "createdAt" DROP DEFAULT,
      ALTER COLUMN "updatedAt" DROP DEFAULT;
    `);
    }
    async down(queryRunner) {
        // Restore defaults (rollback)
        await queryRunner.query(`
      ALTER TABLE "Users" 
      ALTER COLUMN "createdAt" SET DEFAULT now(),
      ALTER COLUMN "updatedAt" SET DEFAULT now();
    `);
        await queryRunner.query(`
      ALTER TABLE "Posts" 
      ALTER COLUMN "createdAt" SET DEFAULT now(),
      ALTER COLUMN "updatedAt" SET DEFAULT now();
    `);
        await queryRunner.query(`
      ALTER TABLE "Comments" 
      ALTER COLUMN "createdAt" SET DEFAULT now(),
      ALTER COLUMN "updatedAt" SET DEFAULT now();
    `);
    }
}
exports.RemoveTimestampDefaults1768772111000 = RemoveTimestampDefaults1768772111000;
//# sourceMappingURL=1768772111000-RemoveTimestampDefaults.js.map