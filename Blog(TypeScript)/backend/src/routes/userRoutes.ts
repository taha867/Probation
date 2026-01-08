import { Router } from "express";
import {
  list,
  getCurrentUser,
  getUserPostsWithComment,
  update,
  remove,
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { handleImageUpload } from "../middleware/uploadMiddleware.js";

const router: Router = Router();

// All user-related read operations now require authentication
router.get("/", authenticateToken, list);
router.get("/me", authenticateToken, getCurrentUser);
router.get("/:id/posts", authenticateToken, getUserPostsWithComment);
// Update user profile with optional image upload
router.put("/:id", authenticateToken, ...handleImageUpload, update);
router.delete("/:id", authenticateToken, remove);

export default router;

