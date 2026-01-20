import { DataSource } from 'typeorm';
/**
 * DataSource configuration for TypeORM migrations
 * This file is only used for running migrations via CLI
 * The actual database connection is handled by TypeOrmModule in app.module.ts
 */
declare const AppDataSource: DataSource;
export default AppDataSource;
//# sourceMappingURL=dataSource.d.ts.map