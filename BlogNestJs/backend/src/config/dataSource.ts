import { DataSource } from 'typeorm';
import { dataSourceOptions } from './data-source-options';

/**
 * DataSource configuration for TypeORM migrations
 * This file is only used for running migrations via CLI
 * The actual database connection is handled by TypeOrmModule in app.module.ts
 */
const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;
