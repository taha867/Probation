import { Router } from "express";
import {
  getPosts,
  getPostComments,
  getPostById,
  deletePost,
  createPost,
  updatePost,
  patchPost
} from "../controllers/postsController.js";

const router = Router();

router.get("/", getPosts);
router.get("/:id/comments", getPostComments);
router.get("/:id", getPostById);
router.delete("/:id", deletePost);
router.post("/", createPost);
router.put("/:id", updatePost);
router.patch("/:id", patchPost);

export default router;
