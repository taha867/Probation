import userController from "./userRoutes.js";
import postRoutes from "./postRoutes.js";
import commentRoutes from "./commentRoutes.js";
import subCommentRoutes from "./subCommentRoutes.js";

export default (app) => {
 
  app.use("/posts", postRoutes);
  app.use("/users", userController);
  app.use("/comments", commentRoutes);
  app.use("/subComments", subCommentRoutes);

  // Create a catch-all route for testing the installation.
  app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

};