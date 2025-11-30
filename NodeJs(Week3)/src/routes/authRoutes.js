import { Router } from "express";
import {
  signUp,
  signIn,
  signOut,
  forgotPassword,
  resetPassword,
  refreshToken,
} from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import {
  signUpSchema,
  signInSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
} from "../validations/authValidation.js";

const router = Router();

router.post("/register", validate(signUpSchema), signUp);
router.post("/login", validate(signInSchema), signIn);
router.post("/logout", authenticateToken, signOut);
router.post("/forgotPassword", validate(forgotPasswordSchema), forgotPassword);
router.post("/resetPassword", validate(resetPasswordSchema), resetPassword);
router.post("/refreshToken", validate(refreshTokenSchema), refreshToken);

export default router;
