"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialSchema1735123456789 = void 0;
const typeorm_1 = require("typeorm");
class InitialSchema1735123456789 {
    async up(queryRunner) {
        // Create Users table
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'Users',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'name',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'email',
                    type: 'varchar',
                    isNullable: false,
                    isUnique: true,
                },
                {
                    name: 'phone',
                    type: 'varchar',
                    isNullable: true,
                    isUnique: true,
                },
                {
                    name: 'password',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'status',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'image',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'imagePublicId',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'last_login_at',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'tokenVersion',
                    type: 'integer',
                    isNullable: false,
                    default: 0,
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'now()',
                    isNullable: false,
                },
                {
                    name: 'updatedAt',
                    type: 'timestamp',
                    default: 'now()',
                    isNullable: false,
                },
            ],
        }), true);
        // Create Posts table
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'Posts',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'title',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'body',
                    type: 'text',
                    isNullable: false,
                },
                {
                    name: 'userId',
                    type: 'integer',
                    isNullable: false,
                },
                {
                    name: 'status',
                    type: 'enum',
                    enum: ['draft', 'published'],
                    default: "'draft'",
                    isNullable: false,
                },
                {
                    name: 'image',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'imagePublicId',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'now()',
                    isNullable: false,
                },
                {
                    name: 'updatedAt',
                    type: 'timestamp',
                    default: 'now()',
                    isNullable: false,
                },
            ],
        }), true);
        // Create Comments table
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'Comments',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'body',
                    type: 'text',
                    isNullable: false,
                },
                {
                    name: 'postId',
                    type: 'integer',
                    isNullable: false,
                },
                {
                    name: 'userId',
                    type: 'integer',
                    isNullable: false,
                },
                {
                    name: 'parentId',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'now()',
                    isNullable: false,
                },
                {
                    name: 'updatedAt',
                    type: 'timestamp',
                    default: 'now()',
                    isNullable: false,
                },
            ],
        }), true);
        // Add foreign keys
        await queryRunner.createForeignKey('Posts', new typeorm_1.TableForeignKey({
            columnNames: ['userId'],
            referencedTableName: 'Users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }));
        await queryRunner.createForeignKey('Comments', new typeorm_1.TableForeignKey({
            columnNames: ['postId'],
            referencedTableName: 'Posts',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }));
        await queryRunner.createForeignKey('Comments', new typeorm_1.TableForeignKey({
            columnNames: ['userId'],
            referencedTableName: 'Users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }));
        await queryRunner.createForeignKey('Comments', new typeorm_1.TableForeignKey({
            columnNames: ['parentId'],
            referencedTableName: 'Comments',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }));
    }
    async down(queryRunner) {
        // Drop foreign keys first
        const commentsTable = await queryRunner.getTable('Comments');
        if (commentsTable) {
            const foreignKeys = commentsTable.foreignKeys;
            for (const fk of foreignKeys) {
                await queryRunner.dropForeignKey('Comments', fk);
            }
        }
        const postsTable = await queryRunner.getTable('Posts');
        if (postsTable) {
            const foreignKeys = postsTable.foreignKeys;
            for (const fk of foreignKeys) {
                await queryRunner.dropForeignKey('Posts', fk);
            }
        }
        // Drop tables
        await queryRunner.dropTable('Comments');
        await queryRunner.dropTable('Posts');
        await queryRunner.dropTable('Users');
    }
}
exports.InitialSchema1735123456789 = InitialSchema1735123456789;
//# sourceMappingURL=1735123456789-InitialSchema.js.map