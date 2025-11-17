import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const getComments = async (req, res) => {
  try {
    const response = await axios.get(`${process.env.API_URL}/comments`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};
