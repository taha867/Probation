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
router.get("/:postId/comments",authenticateToken, listForPost);
router.get("/:id",authenticateToken, get);
router.put("/:id", authenticateToken, update);
router.delete("/:id", authenticateToken, remove);

export default router;
