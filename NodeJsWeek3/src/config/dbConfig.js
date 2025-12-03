import db from "../models/index.js";
import { httpStatus, errorMessages } from "../utils/constants.js";

const { sequelize } = db;

export const initDb = async (res) => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    if (res) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: { message: errorMessages.OPERATION_FAILED } });
    }
    throw error;
  }
};

export default db;
