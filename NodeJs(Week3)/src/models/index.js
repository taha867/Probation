import fs from "fs";
import path from "path";
import Sequelize from "sequelize";
import { fileURLToPath } from "url";
import enVariables from "../../config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment config
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = enVariables[env];

const db = {};

// Setup Sequelize instance
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// Load all model files dynamically using import()
const modelFiles = fs
  .readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js"
  );

for (const file of modelFiles) {
  const modelPath = path.join(__dirname, file);

  const module = await import(modelPath); // <-- IMPORTANT FIX
  const model = module.default(sequelize, Sequelize.DataTypes);

  db[model.name] = model;
}

// Run associations (if any)
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Export
db.sequelize = sequelize; //You are adding the Sequelize connection instance to the db object. 
                          // So you can use it elsewhere in your project. (db.sequelize.sync();)

db.Sequelize = Sequelize; //You are also adding the Sequelize library/class to the db object.
                          //So anywhere in the project, you can access the Sequelize types: (db.Sequelize.DataTypes.STRING;)




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