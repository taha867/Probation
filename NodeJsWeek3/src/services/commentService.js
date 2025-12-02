import model from "../models/index.js";

const { Comment, Post, User } = model;

// Shared include definitions to avoid repetition
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

const includeReplies = {
  model: Comment,
  as: "replies",
  include: [includeAuthor],
  separate: true,
  order: [["createdAt", "ASC"]],
};

export async function createCommentOrReply({ body, postId, parentId, userId }) {
  let finalPostId = postId;

  if (parentId) {
    const parentComment = await Comment.findByPk(parentId);
    if (!parentComment) {
      return { ok: false, reason: "PARENT_NOT_FOUND" };
    }
    finalPostId = parentComment.postId;
  } else {
    const post = await Post.findByPk(postId);
    if (!post) {
      return { ok: false, reason: "POST_NOT_FOUND" };
    }
  }

  const comment = await Comment.create({
    body,
    postId: finalPostId,
    userId,
    parentId,
  });

  const createdComment = await Comment.findByPk(comment.id, {
    include: [
      { model: User, as: "author", attributes: ["id", "name", "email"] },
      { model: Post, as: "post", attributes: ["id", "title"] },
    ],
  });

  return { ok: true, comment: createdComment };
}

export async function listTopLevelComments({ postId }) {
  const where = postId ? { postId } : undefined;

  const comments = await Comment.findAll({
    where: { ...where, parentId: null },
    // For listing, include only author and post to avoid complex nested JOIN
    // Nested replies can be fetched via dedicated endpoints if needed.
    include: [includeAuthor, includePost],
    order: [["createdAt", "DESC"]],
  });

  return comments;
}

export async function findCommentWithRelations(id) {
  return Comment.findByPk(id, {
    // For a single comment, include author and post; replies can be fetched separately if needed.
    include:[includeReplies],
    include: [includeAuthor, includePost],
  });
}

export async function updateCommentForUser({ id, userId, body }) {
  const comment = await Comment.findByPk(id);
  if (!comment) {
    return { ok: false, reason: "NOT_FOUND" };
  }
  if (comment.userId !== userId) {
    return { ok: false, reason: "FORBIDDEN" };
  }

  await comment.update({ body });
  const updated = await findCommentWithRelations(id);
  return { ok: true, comment: updated };
}

export async function deleteCommentForUser({ id, userId }) {
  const comment = await Comment.findByPk(id);
  if (!comment) {
    return { ok: false, reason: "NOT_FOUND" };
  }
  if (comment.userId !== userId) {
    return { ok: false, reason: "FORBIDDEN" };
  }

  await comment.destroy();
  return { ok: true };
}


