import { Op } from "sequelize";
import model from "../models/index.js";

const { User, Post, Comment } = model;

// Include structure for comments with nested replies
const includeCommentAuthor = {
  model: User,
  as: "author",
  attributes: ["id", "name", "email"],
};

const includeCommentReplies = {
  model: Comment,
  as: "replies",
  include: [
    {
      model: User,
      as: "author",
      attributes: ["id", "name", "email"],
    },
  ],
  separate: true, // Fetches replies in a separate query per parent for better performance
  order: [["createdAt", "ASC"]],
};

// Include structure for posts with comments and nested replies
const includePostAuthor = {
  model: User,
  as: "author",
  attributes: ["id", "name", "email"],
};

const includePostComments = {
  model: Comment,
  as: "comments",
  include: [includeCommentAuthor, includeCommentReplies],
  separate: true, // Fetches comments in a separate query for better performance
  order: [["createdAt", "DESC"]],
  where: { parentId: null }, // Only top-level comments (not replies)
};


/**
 * Gets paginated list of all users.
 * @param {Object} req.query - The query parameters for pagination.
 * @param {number} [req.query.page=1] - The page number to retrieve.
 * @param {number} [req.query.limit=20] - The number of users per page (max 100).
 * @returns {Object} Paginated list of users with metadata.
 * @throws {500} If there's an error during the retrieval process.
 */
export async function list(req, res) {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const offset = (page - 1) * limit;

  try {
    const { rows, count } = await User.findAndCountAll({
      attributes: ["id", "name", "email", "phone", "status"],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return res.status(200).send({
      users: rows,
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
      .send({ message: "Unable to fetch users at this time" });
  }
}

/**
 * Gets all posts for a specific user with nested comments and replies.
 * @param {string} req.params.id - The userId of the posts to retrieve.
 * @param {Object} req.query - The query parameters for pagination.
 * @param {number} [req.query.page=1] - The page number to retrieve.
 * @param {number} [req.query.limit=10] - The number of posts per page (max 100).
 * @returns {Object} User information and paginated posts with nested comments.
 * @throws {400} If the user id is invalid.
 * @throws {404} If the user is not found.
 * @throws {500} If there's an error during the retrieval process.
 */
export async function getUserPostsWithComments(req, res) {
  const requestedUserId = Number(req.params.id);

  if (Number.isNaN(requestedUserId)) {
    return res.status(400).send({ message: "Invalid user id" });
  }

  const page = Math.max(parseInt(req.query.page, 10) || 1, 1); // reads page from query string, converts it into INT, ensures page is at least 1 (no zero or negative page numbers).
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100); // // reads Limit from query string, converts it into INT, ensures page is at least 1 (no zero or negative page numbers).
  const offset = (page - 1) * limit; //offset tells the database how many rows to skip before returning results.

  try {
    const user = await User.findByPk(requestedUserId, {
      attributes: ["id", "name", "email"],
    });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const { rows, count } = await Post.findAndCountAll({
      where: { userId: requestedUserId },
      include: [includePostAuthor, includePostComments],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return res.status(200).send({
      user,
      posts: rows,
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
      .send({ message: "Unable to fetch posts for this user" });
  }
}

/**
 * Updates a user's profile information.
 * @param {string} req.params.id - The ID of the user to update.
 * @param {Object} req.body - The request body containing updated user data.
 * @param {string} [req.body.name] - The new name of the user.
 * @param {string} [req.body.email] - The new email address of the user.
 * @param {string} [req.body.phone] - The new phone number of the user.
 * @param {string} [req.body.password] - The new password for the user account.
 * @param {Object} req.user - The authenticated user from JWT token.
 * @returns {Object} The updated user information with 200 status code.
 * @throws {400} If the user id is invalid.
 * @throws {403} If the user is trying to update another user's profile.
 * @throws {404} If the user is not found.
 * @throws {422} If the email or phone already exists for another user.
 * @throws {500} If there's an error during the update process.
 */
export async function update(req, res) {
  const requestedUserId = Number(req.params.id);

  if (Number.isNaN(requestedUserId)) {
    return res.status(400).send({ message: "Invalid user id" });
  }

  // Check if the authenticated user is trying to update their own profile
  if (requestedUserId !== req.user.id) {
    return res
      .status(403)
      .send({ message: "You can only update your own profile" });
  }

  try {
    const user = await User.findByPk(requestedUserId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const { name, email, phone, password } = req.body;
    const updateData = {};

    // Only update fields that are provided
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) {
      // Check if email already exists for another user
      const existingUser = await User.findOne({
        where: {
          email,
          id: { [Op.ne]: requestedUserId }, // Not equal to current user id
        },
      });
      if (existingUser) {
        return res
          .status(422)
          .send({ message: "Email already exists for another user" });
      }
      updateData.email = email;
    }
    if (phone !== undefined) {
      // Check if phone already exists for another user
      const existingUser = await User.findOne({
        where: {
          phone,
          id: { [Op.ne]: requestedUserId }, // Not equal to current user id
        },
      });
      if (existingUser) {
        return res
          .status(422)
          .send({ message: "Phone number already exists for another user" });
      }
      updateData.phone = phone;
    }
    if (password !== undefined) updateData.password = password;

    // If no fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).send({ message: "No fields provided to update" });
    }

    await user.update(updateData);

    // Reload user to get updated data
    await user.reload();

    // Return user data without password
    const { id, name: userName, email: userEmail, phone: userPhone, status } = user;
    return res.status(200).send({
      message: "User updated successfully",
      user: {
        id,
        name: userName,
        email: userEmail,
        phone: userPhone,
        status,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ message: "Unable to update user at this time" });
  }
}

/**
 * Deletes a user account and all associated data (posts, comments).
 * @param {string} req.params.id - The ID of the user to delete.
 * @param {Object} req.user - The authenticated user from JWT token.
 * @returns {Object} Success message with 200 status code.
 * @throws {400} If the user id is invalid.
 * @throws {403} If the user is trying to delete another user's account.
 * @throws {404} If the user is not found.
 * @throws {500} If there's an error during the deletion process.
 */
export async function remove(req, res) {
  const requestedUserId = Number(req.params.id);

  if (Number.isNaN(requestedUserId)) {
    return res.status(400).send({ message: "Invalid user id" });
  }

  // Check if the authenticated user is trying to delete their own account
  if (requestedUserId !== req.user.id) {
    return res
      .status(403)
      .send({ message: "You can only delete your own account" });
  }

  try {
    const user = await User.findByPk(requestedUserId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Delete user (cascade will handle posts and comments)
    await user.destroy();

    return res.status(200).send({
      message: "User account deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ message: "Unable to delete user at this time" });
  }
}
