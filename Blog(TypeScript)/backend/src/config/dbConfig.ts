import { Response } from "express";
import db from "../models/index.js";
import { HTTP_STATUS, ERROR_MESSAGES } from "../utils/constants.js";

const { sequelize } = db;

/**
 * Initialize database connection
 * @param res - Optional Express response object for error handling in HTTP context
 * @returns Promise that resolves when connection is established
 * @throws Error if connection fails and no response object is provided
 */
export const initDb = async (res?: Response): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");
  } catch (error: unknown) {
    console.error("Unable to connect to the database:", error);
    if (res) {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ data: { message: ERROR_MESSAGES.OPERATION_FAILED } });
      return;
    }
    throw error;
  }
};

export default db;

