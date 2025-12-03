import userController from "./userRoutes.js";
import postRoutes from "./postRoutes.js";
import commentRoutes from "./commentRoutes.js";
import authRoutes from "./authRoutes.js";
import { httpStatus, errorMessages } from "../utils/constants.js";

export default (app) => {
 
  app.use("/posts", postRoutes);
  app.use("/users", userController);
  app.use("/comments", commentRoutes);
  app.use("/auth", authRoutes);

  // Create a catch-all route for testing the installation.
  app.use((req, res) => {
    res.status(httpStatus.NOT_FOUND).json({
      data: { message: errorMessages.ROUTE_NOT_FOUND },
    });
  });

};