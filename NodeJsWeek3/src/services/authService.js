import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import model from "../models/index.js";
import { userStatus } from "../utils/constants.js";

const { User } = model;

export async function registerUser({ name, email, phone, password }) {
  const existing = await User.findOne({
    where: { [Op.or]: [{ phone }, { email }] },
  });
  if (existing) {
    return { ok: false, reason: "USER_ALREADY_EXISTS" };
  }

  await User.create({
    name,
    email,
    password,
    phone,
    status: userStatus.loggedOut,
  });

  return { ok: true };
}

export async function authenticateUser({ email, phone, password }) {
  const user = await User.findOne({
    where: email ? { email } : { phone },
  });
  if (!user) {
    return { ok: false, reason: "INVALID_CREDENTIALS" };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return { ok: false, reason: "INVALID_CREDENTIALS" };
  }

  await user.update({
    status: userStatus.loggedIn,
    last_login_at: new Date(),
  });
  await user.reload();

  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, type: "access" },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { userId: user.id, tokenVersion: user.tokenVersion, type: "refresh" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const { id, name, email: userEmail, phone: userPhone, status } = user;
  return {
    ok: true,
    user: {
      id,
      name,
      email: userEmail,
      phone: userPhone,
      status,
    },
    accessToken,
    refreshToken,
  };
}

export async function logoutUser(userId) {
  const user = await User.findByPk(userId);
  if (!user) {
    return { ok: false, reason: "USER_NOT_FOUND" };
  }

  await user.update({
    status: userStatus.loggedOut,
    tokenVersion: user.tokenVersion + 1,
  });

  return { ok: true };
}

export async function verifyAndRefreshToken(refreshToken) {
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return { ok: false, reason: "REFRESH_TOKEN_EXPIRED" };
    }
    return { ok: false, reason: "REFRESH_TOKEN_INVALID" };
  }

  if (decoded.type !== "refresh") {
    return { ok: false, reason: "REFRESH_TOKEN_INVALID" };
  }

  const user = await User.findByPk(decoded.userId);
  if (!user) {
    return { ok: false, reason: "USER_NOT_FOUND" };
  }

  if (user.tokenVersion !== decoded.tokenVersion) {
    return { ok: false, reason: "REFRESH_TOKEN_INVALID" };
  }

  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, type: "access" },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  return {
    ok: true,
    accessToken,
  };
}

export async function createPasswordResetToken(email) {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return { ok: true, userFound: false, resetToken: null };
  }

  const resetToken = jwt.sign(
    { userId: user.id, type: "password_reset" },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { ok: true, userFound: true, resetToken };
}

export async function resetUserPassword(token, newPassword) {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return { ok: false, reason: "RESET_TOKEN_EXPIRED" };
    }
    return { ok: false, reason: "RESET_TOKEN_INVALID" };
  }

  if (decoded.type !== "password_reset") {
    return { ok: false, reason: "RESET_TOKEN_INVALID" };
  }

  const user = await User.findByPk(decoded.userId);
  if (!user) {
    return { ok: false, reason: "USER_NOT_FOUND" };
  }

  await user.update({ password: newPassword });

  return { ok: true };
}


