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

const router = Router();

router.post("/", authenticateToken, create);
router.get("/", list);
// Public routes - anyone can view posts and comments
router.get("/:postId/comments", listForPost);
router.get("/:id", get);
// Protected routes - only authenticated users can modify
router.put("/:id", authenticateToken, update);
router.delete("/:id", authenticateToken, remove);

export default router;
