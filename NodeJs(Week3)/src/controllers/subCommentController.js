import model from "../../models/index.js";

const { SubComment, Comment, User } = model;

const includeAuthor = {
  model: User,
  as: "author",
  attributes: ["id", "name", "email"],
};

const includeParentComment = {
  model: Comment,
  as: "parentComment",
  attributes: ["id", "body"],
};

const findSubCommentOr404 = async (id, res) => {
  const subComment = await SubComment.findByPk(id, {
    include: [includeAuthor, includeParentComment],
  });

  if (!subComment) {
    res.status(404).send({ message: "Sub-comment not found" });
    return null;
  }

  return subComment;
};

export default {
  /*
  URL: POST /sub-comments (body: commentId, body) with Bearer token
  Response: 201 Created with sub-comment details
  Business logic: Validates the parent comment and creates a reply owned by the authenticated user
  */
  async create(req, res) {
    const { body, commentId } = req.body;
    const userId = req.user.id;

    if (!body || !commentId) {
      return res
        .status(400)
        .send({ message: "body and commentId are required fields" });
    }

    try {
      const comment = await Comment.findByPk(commentId);
      if (!comment) {
        return res.status(404).send({ message: "Comment not found" });
      }

      const subComment = await SubComment.create({ body, commentId, userId });
      const createdSubComment = await SubComment.findByPk(subComment.id, {
        include: [includeAuthor, includeParentComment],
      });

      return res.status(201).send(createdSubComment);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Unable to create sub-comment at this time" });
    }
  },

  /*
  URL: GET /sub-comments?commentId=<id> with Bearer token
  Response: 200 OK array of sub-comments (with author + parent comment)
  Business logic: Lists sub-comments, optionally filtered by comment, in reverse chronological order
  */
  async list(req, res) {
    const { commentId } = req.query;
    const where = commentId ? { commentId } : undefined;

    try {
      const subComments = await SubComment.findAll({
        where,
        include: [includeAuthor, includeParentComment],
        order: [["createdAt", "DESC"]],
      });
      return res.status(200).send(subComments);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Unable to fetch sub-comments at this time" });
    }
  },

  /*
  URL: GET /sub-comments/:id with Bearer token
  Response: 200 OK sub-comment payload or 404
  Business logic: Fetches a single sub-comment including parent comment and author
  */
  async get(req, res) {
    try {
      const subComment = await findSubCommentOr404(req.params.id, res);
      if (!subComment) return;

      return res.status(200).send(subComment);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Unable to fetch the requested sub-comment" });
    }
  },

  /*
  URL: PUT /sub-comments/:id (body: body) with Bearer token
  Response: 200 OK updated sub-comment (403 if not owner)
  Business logic: Allows only the author to edit their sub-comment text
  */
  async update(req, res) {
    try {
      const subComment = await findSubCommentOr404(req.params.id, res);
      if (!subComment) return;

      if (subComment.userId !== req.user.id) {
        return res
          .status(403)
          .send({ message: "You can only update your own sub-comments" });
      }

      const { body } = req.body;
      if (!body) {
        return res.status(400).send({ message: "body is required" });
      }

      await subComment.update({ body });
      const updatedSubComment = await SubComment.findByPk(subComment.id, {
        include: [includeAuthor, includeParentComment],
      });

      return res.status(200).send(updatedSubComment);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Unable to update the requested sub-comment" });
    }
  },

  /*
  URL: DELETE /sub-comments/:id with Bearer token
  Response: 204 No Content (403 if not owner)
  Business logic: Deletes a sub-comment only when requested by its author
  */
  async remove(req, res) {
    try {
      const subComment = await findSubCommentOr404(req.params.id, res);
      if (!subComment) return;

      if (subComment.userId !== req.user.id) {
        return res
          .status(403)
          .send({ message: "You can only delete your own sub-comments" });
      }

      await subComment.destroy();
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Unable to delete the requested sub-comment" });
    }
  },
};

