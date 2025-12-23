import { Router } from "express";
import { getUploadSignature } from "../controllers/uploadController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

// Generate signed upload parameters for Cloudinary direct upload
router.post("/signature", authenticateToken, getUploadSignature);

export default router;

