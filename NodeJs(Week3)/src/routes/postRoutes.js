import { Router } from "express";
import postController from "../controllers/postController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", authenticateToken, postController.create);
router.get("/", postController.list);
router.get("/:postId/comments", postController.listForPost);
router.get("/:id", postController.get);
router.put("/:id", authenticateToken, postController.update);
router.delete("/:id", authenticateToken, postController.remove);

export default router;

