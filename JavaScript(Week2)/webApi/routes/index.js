import { Router } from "express";
import usersRoutes from "./usersRoutes.js";
import postsRoutes from "./postsRoutes.js";
import commentsRoutes from "./commentsRoutes.js";

const router = Router();

router.use("/comments", commentsRoutes);
router.use("/users", usersRoutes);
router.use("/posts", postsRoutes);

export default router;
