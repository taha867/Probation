import models from "../models/index.js";
import { HTTP_STATUS } from "../utils/constants.js";
import { AppError } from "../utils/errors.js";

export class CommentService {
  constructor(models) {
    this.Comment = models.Comment;
    this.Post = models.Post;
    this.User = models.User;

    this.includeAuthor = {
      model: this.User,
      as: "author",
      attributes: ["id", "name", "email"],
    };

    this.includePost = {
      model: this.Post,
      as: "post",
      attributes: ["id", "title"],
    };

    // We will load replies in a separate query to avoid complex nested JOINs
    // that were causing Postgres errors with missing aliases.
  }

  async createCommentOrReply({ body, postId, parentId, userId }) {
    let finalPostId = postId;

    if (parentId) {
      const parentComment = await this.Comment.findByPk(parentId);
      if (!parentComment) {
        throw new AppError("PARENT_COMMENT_NOT_FOUND", HTTP_STATUS.NOT_FOUND);
      }
      finalPostId = parentComment.postId;
    } else {
      const post = await this.Post.findByPk(postId);
      if (!post) {
        throw new AppError("POST_NOT_FOUND", HTTP_STATUS.NOT_FOUND);
      }
    }

    const comment = await this.Comment.create({
      body,
      postId: finalPostId,
      userId,
      parentId,
    });

    const createdComment = await this.Comment.findByPk(comment.id, {
      include: [this.includeAuthor, this.includePost],
    });

    return { ok: true, comment: createdComment };
  }

  async listTopLevelComments({ postId }) {
    const where = postId ? { postId } : undefined;

    const comments = await this.Comment.findAll({
      where: { ...where, parentId: null },
      include: [this.includeAuthor, this.includePost],
      order: [["createdAt", "DESC"]],
    });

    return comments;
  }

  async findCommentWithRelations(id) {
    // Load the main comment with its author and post
    const comment = await this.Comment.findByPk(id, {
      include: [this.includeAuthor, this.includePost],
    });

    if (!comment) return null;

    // Load replies for this comment (if any), including their authors
    const replies = await this.Comment.findAll({
      where: { parentId: id },
      include: [this.includeAuthor],
      order: [["createdAt", "ASC"]],
    });

    // Attach replies to the returned comment object
    const commentJson = comment.toJSON();
    commentJson.replies = replies;

    return commentJson;
  }

  async updateCommentForUser({ id, userId, body }) {
    const comment = await this.Comment.findByPk(id);
    if (!comment) {
      throw new AppError("COMMENT_NOT_FOUND", HTTP_STATUS.NOT_FOUND);
    }
    if (comment.userId !== userId) {
      throw new AppError("CANNOT_UPDATE_OTHER_COMMENT", HTTP_STATUS.FORBIDDEN);
    }

    await comment.update({ body });
    const updated = await this.findCommentWithRelations(id);
    return { ok: true, comment: updated };
  }

  async deleteCommentForUser({ id, userId }) {
    const comment = await this.Comment.findByPk(id);
    if (!comment) {
      throw new AppError("COMMENT_NOT_FOUND", HTTP_STATUS.NOT_FOUND);
    }
    if (comment.userId !== userId) {
      throw new AppError("CANNOT_DELETE_OTHER_COMMENT", HTTP_STATUS.FORBIDDEN);
    }

    await comment.destroy();
    return { ok: true };
  }
}

export const commentService = new CommentService(models);

