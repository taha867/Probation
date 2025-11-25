import { Router } from "express";
import commentController from "../controllers/commentController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", authenticateToken, commentController.create);
router.get("/", authenticateToken, commentController.list);
router.get("/:id", authenticateToken, commentController.get);
router.put("/:id", authenticateToken, commentController.update);
router.delete("/:id", authenticateToken, commentController.remove);

export default router;

