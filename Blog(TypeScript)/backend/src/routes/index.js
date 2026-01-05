import userController from "./userRoutes.js";
import postRoutes from "./postRoutes.js";
import commentRoutes from "./commentRoutes.js";
import authRoutes from "./authRoutes.js";
import { HTTP_STATUS, ERROR_MESSAGES } from "../utils/constants.js";

export default (app) => {
 
  app.use("/posts", postRoutes);
  app.use("/users", userController);
  app.use("/comments", commentRoutes);
  app.use("/auth", authRoutes);

  // Create a catch-all route for testing the installation.
  app.use((req, res) => {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      data: { message: ERROR_MESSAGES.ROUTE_NOT_FOUND },
    });
  });

};