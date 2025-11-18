import { Router } from "express";
import { getComments } from "../controllers/commentsController.js";
import { getCommentsOnPost } from "../controllers/commentsController.js";

const router = Router();

router.get("/", getComments);
router.get("/post", getCommentsOnPost);

export default router;
