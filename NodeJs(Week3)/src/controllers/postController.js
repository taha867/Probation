import { Op } from "sequelize";
import model from "../../models/index.js";

const { Post, User } = model;

const findPostOr404 = async (id, res) => {
  const post = await Post.findByPk(id, {
    include: [{ model: User, as: "author", attributes: ["id", "name", "email"] }],
  });

  if (!post) {
    res.status(404).send({ message: "Post not found" });
    return null;
  }

  return post;
};

export default {
  /*
  URL: POST /posts (body: title, body, status?) with Bearer token
  Response: 201 Created with the persisted post record
  Business logic: Creates a new post owned by the authenticated user after validating required fields
  */
  async create(req, res) {
    const { title, body, status } = req.body;
    const userId = req.user.id; // Get userId from authenticated user

    if (!title || !body) {
      return res
        .status(400)
        .send({ message: "title and body are required fields" });
    }

    try {
      const post = await Post.create({ title, body, userId, status });
      return res.status(201).send(post);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Unable to create post at this time" });
    }
  },

  /*
  URL: GET /posts?page=<page>&limit=<limit>&q=<search>&userId=<userId>
  Response: 200 OK with { data: Post[], meta: { total, page, limit, totalPages } }
  Business logic: Returns a public paginated list of posts with optional search and user filtering
  */
  async list(req, res) {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100);
    const offset = (page - 1) * limit;
    const { q, userId } = req.query;

    const where = {};
    if (userId) {
      where.userId = userId;
    }
    if (q) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${q}%` } },
        { body: { [Op.iLike]: `%${q}%` } },
      ];
    }

    try {
      const { rows, count } = await Post.findAndCountAll({
        where,
        include: [{ model: User, as: "author", attributes: ["id", "name", "email"] }],
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
        .send({ message: "Unable to fetch posts at this time" });
    }
  },

  /*
  URL: GET /posts/:id
  Response: 200 OK with the post payload (or 404 if missing)
  Business logic: Fetches a single post along with its author for any requester
  */
  async get(req, res) {
    try {
      const post = await findPostOr404(req.params.id, res);
      if (!post) return;

      return res.status(200).send(post);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Unable to fetch the requested post" });
    }
  },

  /*
  URL: PUT /posts/:id (body: title/body/status) with Bearer token
  Response: 200 OK with the updated post (403 if not owner)
  Business logic: Ensures ownership before updating post fields for the authenticated user
  */
  async update(req, res) {
    try {
      const post = await findPostOr404(req.params.id, res);
      if (!post) return;

      // Check if the authenticated user owns this post
      if (post.userId !== req.user.id) {
        return res.status(403).send({ message: "You can only update your own posts" });
      }

      const { title, body, status } = req.body;
      await post.update({ title, body, status });

      return res.status(200).send(post);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Unable to update the requested post" });
    }
  },

  /*
  URL: DELETE /posts/:id with Bearer token
  Response: 204 No Content on success (403 if not owner)
  Business logic: Deletes a post only when requested by the owner
  */
  async remove(req, res) {
    try {
      const post = await findPostOr404(req.params.id, res);
      if (!post) return;

      // Check if the authenticated user owns this post
      if (post.userId !== req.user.id) {
        return res.status(403).send({ message: "You can only delete your own posts" });
      }

      await post.destroy();
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Unable to delete the requested post" });
    }
  },
};

