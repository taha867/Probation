import { Router } from "express";

import usersRoutes from "./usersRoutes.js";
import postsRoutes from "./postsRoutes.js";
import commentsRoutes from "./commentsRoutes.js";

const router = Router();

router.use("/", usersRoutes);
router.use("/", postsRoutes);
router.use("/", commentsRoutes);

export default router;
