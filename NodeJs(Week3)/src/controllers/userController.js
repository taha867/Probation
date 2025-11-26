import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import model from "../models/index.js";

const { User, Post, Comment, SubComment } = model;


  /*
  URL: POST /users/register (body: name, email, phone, password)
  Response: 201 Created on success or 422 if email/phone already registered
  Business logic: Registers a new user after ensuring unique email/phone
  */
  export async function signUp(req, res) {
    const { email, password, name, phone } = req.body;
    try {
      const user = await User.findOne({
        where: { [Op.or]: [{ phone }, { email }] }, //[op.or] used to check multiple parameters (or means either phone or email, in case of and it would be both email and phone no)
      });
      if (user) {
        return res
          .status(422) //Unprocessable Entity
          .send({ message: "User with that email or phone already exists" });
      }
      //Model instance
      //does build + save for you, so the row is created in the database (async).
      await User.create({
        name,
        email,
        password,
        phone,
      });
      return res.status(201).send({ message: "Account created successfully" });
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        message:
          "Could not perform operation at this time, kindly try again later.",
      });
    }
  };

  /*
  URL: POST /users/login (body: email|phone, password)
  Response: 200 OK with JWT token and user profile, 401 on invalid credentials
  Business logic: Authenticates a user, records login metadata, and issues a JWT
  */
 export async function signIn(req, res) {
    const { email, phone, password } = req.body;

    if (!password || (!email && !phone)) {
      return res.status(400).send({
        message:
          "Please provide your password and either email or phone number",
      });
    }

    try {
      const user = await User.findOne({
        where: email ? { email } : { phone },
      });

      if (!user) {
        return res.status(401).send({ message: "Invalid credentials" });
      }

      if (user.password !== password) {
        return res.status(401).send({ message: "Invalid credentials" });
      }

      await user.update({
        last_login_at: new Date(),
        last_ip_address: req.ip,
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      const { id, name, email: userEmail, phone } = user;
      return res.status(200).send({
        message: "Signed in successfully",
        token,
        user: {
          id,
          name,
          email: userEmail,
          phone,
        },
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        message:
          "Could not perform operation at this time, kindly try again later.",
      });
    }
  };

  /*
  URL: GET /users?page=<page>&limit=<limit>
  Response: 200 OK with paginated list of users (excluding passwords)
  Business logic: Lists all users for public consumption with pagination
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
        .send({ message: "Unable to fetch users at this time" });
    }
  };

  /*
  URL: GET /users/:id/posts?page=<page>&limit=<limit>
  Response: 200 OK with user info plus paginated posts + comments + sub-comments
  Business logic: Returns all posts for a given user along with nested discussion threads
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
        include: [
          {
            model: Comment,
            as: "comments",
            include: [
              {
                model: User,
                as: "author",
                attributes: ["id", "name", "email"],
              },
              {
                model: SubComment,
                as: "subComments",
                include: [
                  {
                    model: User,
                    as: "author",
                    attributes: ["id", "name", "email"],
                  },
                ],
              },
            ],
            order: [["createdAt", "DESC"]],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit,
        offset,
      });

      return res.status(200).send({
        user,
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
        .send({ message: "Unable to fetch posts for this user" });
    }
  };
