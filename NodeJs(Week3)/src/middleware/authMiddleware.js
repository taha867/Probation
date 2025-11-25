import jwt from "jsonwebtoken";
import model from "../../models/index.js";

const { User } = model;

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateToken = async (req, res, next) => {
  try {
    //Reads token from headers
    //Authorization: Bearer xyz123token
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN (xyz123token, This extracts the token only.)

    if (!token) {
      return res.status(401).send({ message: "Access token is required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.userId);//Find the user in database, Because, Token may be valid BUT user might be deleted If no user exists: reject

    if (!user) {
      return res.status(401).send({ message: "Invalid token - user not found" });
    }

    req.user = user; // Attach user to request object
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).send({ message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).send({ message: "Token expired" });
    }
    console.error("Auth middleware error:", error);
    return res.status(500).send({ message: "Authentication failed" });
  }
};

export default authenticateToken;

