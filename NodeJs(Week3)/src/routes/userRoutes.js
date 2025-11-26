import { Router } from "express";
import { signUp, signIn, list, getUserPostsWithComments } from "../controllers/userController.js";

const router = Router();

router.post("/register", signUp);
router.post("/login", signIn);
router.get("/", list);
router.get("/:id/posts", getUserPostsWithComments);

export default router;
