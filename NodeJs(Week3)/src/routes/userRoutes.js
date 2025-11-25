import { Router } from "express";
import userController from "../controllers/userController.js";

const router = Router();

router.post("/register", userController.signUp);
router.post("/login", userController.signIn);
router.get("/", userController.list);
router.get("/:id/posts", userController.getUserPostsWithComments);

export default router;
