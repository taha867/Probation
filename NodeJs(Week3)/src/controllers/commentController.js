import model from "../../models/index.js";

const { Comment, Post, User, SubComment } = model;

const includeAuthor = {
  model: User,
  as: "author",
  attributes: ["id", "name", "email"],
};

const includePost = {
  model: Post,
  as: "post",
  attributes: ["id", "title"],
};

const includeSubComments = {
  model: SubComment,
  as: "subComments",
  include: [
    {
      model: User,
      as: "author",
      attributes: ["id", "name", "email"],
    },
  ],
};

const findCommentOr404 = async (id, res) => {
  const comment = await Comment.findByPk(id, {
    include: [includeAuthor, includePost, includeSubComments],
  });

  if (!comment) {
    res.status(404).send({ message: "Comment not found" });
    return null;
  }

  return comment;
};

export default {
  /*
  URL: POST /comments (body: postId, body) with Bearer token
  Response: 201 Created with the saved comment
  Business logic: Validates the post and persists a comment owned by the authenticated user
  */
  async create(req, res) {
    const { body, postId } = req.body;
    const userId = req.user.id;

    if (!body || !postId) {
      return res
        .status(400)
        .send({ message: "body and postId are required fields" });
    }

    try {
      const post = await Post.findByPk(postId);
      if (!post) {
        return res.status(404).send({ message: "Post not found" });
      }

      const comment = await Comment.create({ body, postId, userId });
      return res.status(201).send(comment);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Unable to create comment at this time" });
    }
  },

  /*
  URL: GET /comments?postId=<id> with Bearer token
  Response: 200 OK array of comments (with authors/posts/subComments)
  Business logic: Returns comments, optionally filtered by post, for authenticated users
  */
  async list(req, res) {
    const { postId } = req.query;
    const where = postId ? { postId } : undefined;

    try {
      const comments = await Comment.findAll({
        where,
        include: [includeAuthor, includePost, includeSubComments],
        order: [["createdAt", "DESC"]],
      });
      return res.status(200).send(comments);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Unable to fetch comments at this time" });
    }
  },

  /*
  URL: GET /comments/:id with Bearer token
  Response: 200 OK single comment or 404 if missing
  Business logic: Fetches a specific comment including related entities
  */
  async get(req, res) {
    try {
      const comment = await findCommentOr404(req.params.id, res);
      if (!comment) return;

      return res.status(200).send(comment);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Unable to fetch the requested comment" });
    }
  },

  /*
  URL: PUT /comments/:id (body: body) with Bearer token
  Response: 200 OK updated comment (403 if not owner)
  Business logic: Checks ownership before allowing comment text updates
  */
  async update(req, res) {
    try {
      const comment = await findCommentOr404(req.params.id, res);
      if (!comment) return;

      if (comment.userId !== req.user.id) {
        return res
          .status(403)
          .send({ message: "You can only update your own comments" });
      }

      const { body } = req.body;
      if (!body) {
        return res.status(400).send({ message: "body is required" });
      }

      await comment.update({ body });
      return res.status(200).send(comment);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Unable to update the requested comment" });
    }
  },

  /*
  URL: DELETE /comments/:id with Bearer token
  Response: 204 No Content (403 if not owner)
  Business logic: Deletes a comment only if requested by its author
  */
  async remove(req, res) {
    try {
      const comment = await findCommentOr404(req.params.id, res);
      if (!comment) return;

      if (comment.userId !== req.user.id) {
        return res
          .status(403)
          .send({ message: "You can only delete your own comments" });
      }

      await comment.destroy();
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Unable to delete the requested comment" });
    }
  },

  /*
  URL: GET /posts/:postId/comments?page=<page>&limit=<limit>
  Response: 200 OK with paginated comments for the post (each includes sub-comments)
  Business logic: Provides a public endpoint to browse comments and their replies for a post
  */
  async listForPost(req, res) {
    const postId = Number(req.params.postId);
    if (Number.isNaN(postId)) {
      return res.status(400).send({ message: "Invalid post id" });
    }

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100);
    const offset = (page - 1) * limit;

    try {
      const postExists = await Post.findByPk(postId);
      if (!postExists) {
        return res.status(404).send({ message: "Post not found" });
      }

      const { rows, count } = await Comment.findAndCountAll({
        where: { postId },
        include: [includeAuthor, includeSubComments],
        order: [["createdAt", "DESC"]],
        limit,
        offset,
      });

      return res.status(200).send({
        data: rows,
        meta: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Unable to fetch comments for this post" });
    }
  },
};

