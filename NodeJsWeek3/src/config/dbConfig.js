import db from "../models/index.js";
import { HTTP_STATUS, ERROR_MESSAGES } from "../utils/constants.js";

const { sequelize } = db;

export const initDb = async (res) => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    if (res) {
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ data: { message: ERROR_MESSAGES.OPERATION_FAILED } });
    }
    throw error;
  }
};

export default db;
