import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
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
 * Registers a new user account.
 * @param {Object} req.body - The request body containing user registration data.
 * @param {string} req.body.name - The name of the user.
 * @param {string} req.body.email - The email address of the user.
 * @param {string} req.body.phone - The phone number of the user.
 * @param {string} req.body.password - The password for the user account.
 * @returns {Object} Success message with 201 status code.
 * @throws {422} If email or phone already exists in the database.
 * @throws {500} If there's an error during the registration process.
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
      status: "logged out",
    });
    return res.status(201).send({ message: "Account created successfully" });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      message:
        "Could not perform operation at this time, kindly try again later.",
    });
  }
}

/**
 * Authenticates a user and generates a JWT token.
 * @param {Object} req.body - The request body containing login credentials.
 * @param {string} [req.body.email] - The email address of the user (optional if phone is provided).
 * @param {string} [req.body.phone] - The phone number of the user (optional if email is provided).
 * @param {string} req.body.password - The password for authentication.
 * @returns {Object} JWT token and user profile with 200 status code.
 * @throws {400} If password or both email and phone are missing.
 * @throws {401} If invalid credentials are provided.
 * @throws {500} If there's an error during the authentication process.
 */
export async function signIn(req, res) {
  const { email, phone, password } = req.body;

  if (!password || (!email && !phone)) {
    return res.status(400).send({
      message: "Please provide your password and either email or phone number",
    });
  }

  try {
    const user = await User.findOne({
      where: email ? { email } : { phone },
    });

    if (!user) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    // Compare provided password with hashed password in database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    await user.update({
      status: "logged in",
      last_login_at: new Date(),
      last_ip_address: req.ip,
    });

    // Reload user to get updated status
    await user.reload();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    const { id, name, email: userEmail, phone, status } = user;
    return res.status(200).send({
      message: "Signed in successfully",
      token,
      user: {
        id,
        name,
        email: userEmail,
        phone,
        status,
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      message:
        "Could not perform operation at this time, kindly try again later.",
    });
  }
}

/**
 * Logs out a user by updating their status to "logged out".
 * @param {Object} req.user - The authenticated user from JWT token.
 * @returns {Object} Success message with 200 status code.
 * @throws {404} If the user is not found.
 * @throws {500} If there's an error during the logout process.
 */
export async function signOut(req, res) {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    await user.update({
      status: "logged out",
    });

    return res.status(200).send({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message:
        "Could not perform operation at this time, kindly try again later.",
    });
  }
}