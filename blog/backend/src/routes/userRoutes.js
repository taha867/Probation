import { Router } from "express";
import {
  list,
  getCurrentUser,
  getUserPostsWithComment,
  update,
  remove,
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

// All user-related read operations now require authentication
router.get("/", authenticateToken, list);
router.get("/me", authenticateToken, getCurrentUser);
router.get("/:id/posts", authenticateToken, getUserPostsWithComment);
router.put("/:id", authenticateToken, update);
router.delete("/:id", authenticateToken, remove);

export default router;
