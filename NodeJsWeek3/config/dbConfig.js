import db from "../models/index.js";

const { sequelize } = db;

export const initDb = async () => {
try {
  await sequelize.authenticate();
    console.log("Database connection established successfully.");
} catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
}
};

export default db;