"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const data_source_options_1 = require("./data-source-options");
/**
 * DataSource configuration for TypeORM migrations
 * This file is only used for running migrations via CLI
 * The actual database connection is handled by TypeOrmModule in app.module.ts
 */
const AppDataSource = new typeorm_1.DataSource(data_source_options_1.dataSourceOptions);
exports.default = AppDataSource;
//# sourceMappingURL=dataSource.js.map