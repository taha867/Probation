import { Router } from "express";
import {
  list,
  getUserPostsWithComment,
  update,
  remove,
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", list);
router.get("/:id/posts", getUserPostsWithComment);
router.put("/:id", authenticateToken, update);
router.delete("/:id", authenticateToken, remove);

export default router;
