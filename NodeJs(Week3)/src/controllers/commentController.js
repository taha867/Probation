import model from "../models/index.js";

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

/*
URL: POST /comments (body: postId, body) with Bearer token
Response: 201 Created with the saved comment
Business logic: Validates the post and persists a comment owned by the authenticated user
*/
export async function create(req, res) {
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
}

/*
URL: GET /comments?postId=<id> with Bearer token
Response: 200 OK array of comments (with authors/posts/subComments)
Business logic: Returns comments, optionally filtered by post, for authenticated users
*/
export async function list(req, res) {
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
}

/*
URL: GET /comments/:id with Bearer token
Response: 200 OK single comment or 404 if missing
Business logic: Fetches a specific comment including related entities
*/
export async function get(req, res) {
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
}

/*
URL: PUT /comments/:id (body: body) with Bearer token
Response: 200 OK updated comment (403 if not owner)
Business logic: Checks ownership before allowing comment text updates
*/
export async function update(req, res) {
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
}

/*
URL: DELETE /comments/:id with Bearer token
Response: 204 No Content (403 if not owner)
Business logic: Deletes a comment only if requested by its author
*/
export async function remove(req, res) {
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
  }
