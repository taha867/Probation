import { Router } from "express";
import {
  signUp,
  signIn,
  signOut,
} from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", signUp);
router.post("/login", signIn);
router.post("/logout", authenticateToken, signOut);

export default router;