import { Response } from "express";
import { AppDataSource } from "./data-source.js";
import { HTTP_STATUS, ERROR_MESSAGES } from "../utils/constants.js";

/**
 * Initialize database connection
 * @param res - Optional Express response object for error handling in HTTP context
 * @returns Promise that resolves when connection is established
 * @throws Error if connection fails and no response object is provided
 */
export const initDb = async (res?: Response): Promise<void> => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    console.log("Database connection established successfully.");
    }
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

/**
 * Close database connection
 * Used for graceful shutdown
 */
export const closeDb = async (): Promise<void> => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    console.log("Database connection closed.");
  }
};

