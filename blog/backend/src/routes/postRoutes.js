import { Router } from "express";
import {
  create,
  list,
  get,
  listForPost,
  update,
  remove,
} from "../controllers/postController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { handleImageUpload } from "../middleware/uploadMiddleware.js";

const router = Router();

// Create post with optional image upload
router.post("/",authenticateToken, ...handleImageUpload, create);
router.get("/", list);
// Public routes - anyone can view posts and comments
router.get("/:postId/comments", listForPost);
router.get("/:id", get);
// Update post with optional image upload
router.put("/:id",authenticateToken, ...handleImageUpload, update);
router.delete("/:id", authenticateToken, remove);

export default router;
