import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
//get all comments
export const getComments = async (req, res) => {
  try {
    const response = await axios.get(`${process.env.API_URL}/comments`);
    res.status(200).json({ data: response.data });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

//get comments of a specific post id
export const getCommentsOnPost = async (req, res) => {
  try {
    const { postId } = req.query;
    const response = await axios.get(`${process.env.API_URL}/comments`, {
      params: { postId },
    });
    res.status(200).json({ data: response.data });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};
