import { Express, Request, Response } from "express";
import userController from "./userRoutes.js";
import postRoutes from "./postRoutes.js";
import commentRoutes from "./commentRoutes.js";
import authRoutes from "./authRoutes.js";
import { HTTP_STATUS, ERROR_MESSAGES } from "../utils/constants.js";

export default function registerRoutes(app: Express): void {
  // Register route handlers
  app.use("/posts", postRoutes);
  app.use("/users", userController);
  app.use("/comments", commentRoutes);
  app.use("/auth", authRoutes);

  // Catch-all route for 404 handling
  // This must be last to catch any unmatched routes
  app.use((_req: Request, res: Response): void => {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      data: { message: ERROR_MESSAGES.ROUTE_NOT_FOUND },
    });
  });
}

