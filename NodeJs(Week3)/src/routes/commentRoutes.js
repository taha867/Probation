import { Router } from "express";
import { create, list, get, update, remove } from "../controllers/commentController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import {
  createCommentSchema,
  updateCommentSchema,
  listCommentsQuerySchema,
  commentIdParamSchema,
} from "../validations/commentValidation.js";

const router = Router();

router.post("/", authenticateToken, validate(createCommentSchema), create);
router.get("/", authenticateToken, validate(listCommentsQuerySchema, "query"), list);
router.get("/:id", authenticateToken, validate(commentIdParamSchema, "params"), get);
router.put(
  "/:id",
  authenticateToken,
  validate(commentIdParamSchema, "params"),
  validate(updateCommentSchema),
  update
);
router.delete("/:id", authenticateToken, validate(commentIdParamSchema, "params"), remove);

export default router;

