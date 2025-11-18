import { Router } from "express";
import { getUsers } from "../controllers/usersController.js";
import { getPostsOfUser } from "../controllers/usersController.js";

const router = Router();

router.get("/", getUsers);
router.get("/:id/posts", getPostsOfUser);

export default router;
