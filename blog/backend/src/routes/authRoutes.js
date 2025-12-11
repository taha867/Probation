import { Router } from "express";
import {
  signUp,
  signIn,
  signOut,
  forgotPassword,
  resetPassword,
  refreshToken,
} from "../controllers/authController.js";
import {
  authenticateToken,
  loginRateLimiter,
} from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", signUp);
router.post("/login", loginRateLimiter, signIn);
router.post("/logout", authenticateToken, signOut);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);
router.post("/refreshToken", refreshToken);

export default router;
