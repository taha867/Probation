import { Router } from "express";
import { create, list, get, update, remove } from "../controllers/subCommentController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", authenticateToken, create);
router.get("/", authenticateToken, list);
router.get("/:id", authenticateToken, get);
router.put("/:id", authenticateToken, update);
router.delete("/:id", authenticateToken, remove);

export default router;

