import { Router } from "express";
import { 
  getPosts, 
  getPostComments, 
  getPostById, 
  deletePost 
} from "../controllers/postsController.js";

const router = Router();

router.get("/posts", getPosts);
router.get("/posts/:id/comments", getPostComments);
router.get("/posts/:id", getPostById);
router.delete("/posts/:id", deletePost);

export default router;
