import fs from "fs";
import path from "path";
import { Sequelize, DataTypes, Model } from "sequelize";
import { fileURLToPath } from "url";
import envVariables from "../../config.js"; // Keep .js extension - TypeScript resolves to .ts

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Type for a model function that initializes a Sequelize model
 */
type ModelInitializer = (
  sequelize: Sequelize,
  dataTypes: typeof DataTypes
) => typeof Model & {
  associate?: (models: DatabaseModels) => void;
};

/**
 * Type for a Sequelize model with optional associate method
 */
type ModelWithAssociate = typeof Model & {
  associate?: (models: DatabaseModels) => void;
};

/**
 * Type for the database models object
 * This will be populated dynamically with model instances
 * Uses a more flexible approach: models are stored with string keys,
 * while sequelize and Sequelize are explicitly typed
 */
export interface DatabaseModels {
  // Index signature for dynamically loaded models
  [key: string]: ModelWithAssociate | Sequelize | typeof Sequelize;
  // Explicit properties (these override the index signature)
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
}

// Load environment config
const basename = path.basename(__filename);
const env: string = process.env.NODE_ENV || "development";
const config = envVariables[env as keyof typeof envVariables];

const db: DatabaseModels = {} as DatabaseModels;

// Setup Sequelize instance
let sequelize: Sequelize;
try {
  if (config.use_env_variable) {
    const envVar = process.env[config.use_env_variable];
    if (!envVar) {
      throw new Error(
        `Environment variable ${config.use_env_variable} is not set`
      );
    }
    sequelize = new Sequelize(envVar, config as any);
  } else {
    if (!config.database || !config.username || !config.host) {
      throw new Error("Database configuration is incomplete");
    }
    sequelize = new Sequelize(
      config.database!,
      config.username || "",
      config.password || "",
      config as any
    );
  }
} catch (sequelizeError: unknown) {
  console.error("Failed to initialize Sequelize:", sequelizeError);
  // Re-throw to prevent silent failures
  throw sequelizeError;
}

// Load all model files dynamically using import()
const modelFiles: string[] = fs
  .readdirSync(__dirname)
  .filter(
    (file: string) =>
      file.indexOf(".") !== 0 &&
      file !== basename &&
      (file.slice(-3) === ".js" || file.slice(-3) === ".ts")
  );

for (const file of modelFiles) {
  const modelPath = path.join(__dirname, file);

  try {
    const module = await import(modelPath);
    const modelInitializer = module.default as ModelInitializer;
    const model = modelInitializer(sequelize, DataTypes);

    db[model.name] = model;
  } catch (error: unknown) {
    console.error(`Failed to load model ${file}:`, error);
    // Continue loading other models even if one fails
  }
}

// Run associations (if any)
Object.keys(db).forEach((modelName: string) => {
  const model = db[modelName];
  // Type guard: check if it's a model with associate method
  if (
    model &&
    typeof model === "function" &&
    "associate" in model &&
    typeof model.associate === "function"
  ) {
    model.associate(db);
  }
});

// Export
db.sequelize = sequelize; // You are adding the Sequelize connection instance to the db object.
// So you can use it elsewhere in your project. (db.sequelize.sync();)

db.Sequelize = Sequelize; // You are also adding the Sequelize library/class to the db object.
// So anywhere in the project, you can access the Sequelize types: (db.Sequelize.DataTypes.STRING;)

export default db;
/*{
  User: <UserModel>,
  Post: <PostModel>,
  Comment: <CommentModel>,
  sequelize: <SequelizeConnection>,
  Sequelize: <SequelizeClass>
}
This object contains everything related to your database, and you can import it anywhere.
*/

