import { Router } from "express";
import {
  create,
  list,
  get,
  listForPost,
  update,
  remove,
} from "../controllers/postController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import {
  createPostSchema,
  updatePostSchema,
  listPostsQuerySchema,
  postidParamSchema,
  postIdParamForCommentsSchema,
} from "../validations/postValidation.js";

const router = Router();

router.post("/", authenticateToken, validate(createPostSchema), create);
router.get("/", validate(listPostsQuerySchema, "query"), list);
router.get(
  "/:postId/comments",
  validate(postIdParamForCommentsSchema, "params"),
  validate(listPostsQuerySchema, "query"),
  listForPost
);
router.get("/:id", validate(postidParamSchema, "params"), get);
router.put(
  "/:id",
  authenticateToken,
  validate(postIdParamSchema, "params"),
  validate(updatePostSchema),
  update
);
router.delete(
  "/:id",
  authenticateToken,
  validate(postIdParamSchema, "params"),
  remove
);

export default router;
