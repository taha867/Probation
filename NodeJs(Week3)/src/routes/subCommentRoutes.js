import { Router } from "express";
import subCommentController from "../controllers/subCommentController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

// All sub-comment routes require authentication
router.post("/", authenticateToken, subCommentController.create);
router.get("/", authenticateToken, subCommentController.list);
router.get("/:id", authenticateToken, subCommentController.get);
router.put("/:id", authenticateToken, subCommentController.update);
router.delete("/:id", authenticateToken, subCommentController.remove);

export default router;

