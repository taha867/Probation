import { Router } from "express";
import {
  list,
  getUserPostsWithComments,
  update,
  remove,
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import {
  getUserPostsQuerySchema,
  updateUserSchema,
  userIdParamSchema,
  listUsersQuerySchema,
} from "../validations/userValidation.js";

const router = Router();

router.get("/", validate(listUsersQuerySchema, "query"), list);
router.get(
  "/:id/posts",
  validate(userIdParamSchema, "params"),
  validate(getUserPostsQuerySchema, "query"),
  getUserPostsWithComments
);
router.put(
  "/:id",
  authenticateToken,
  validate(userIdParamSchema, "params"),
  validate(updateUserSchema),
  update
);
router.delete(
  "/:id",
  authenticateToken,
  validate(userIdParamSchema, "params"),
  remove
);

export default router;
