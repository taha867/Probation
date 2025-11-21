import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

/**
 * What this function receives:
 *   - It doesn't need anything from the URL; it just takes req and res.

 * Business Logic:
 *   - It simply calls the external API and gets all the comments.
 
 * Response:
 *   - Sends back the full list on success, or an error message if something fails.
 */
export const getComments = async (req, res) => {
  try {
    const response = await axios.get(`${process.env.API_URL}/comments`);
    res.status(200).json({ data: response.data });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

/**
 * What this function receives:
 *   - It expects a postId in req.query, like: /comments/post?postId=3
 
 * Business Logic:
 *   - It forwards that postId to the API so the API can return only matching comments.
 
 * Response:
 *   - Sends the filtered list of comments, or an error if something goes wrong.
 */
export const getCommentsOnPost = async (req, res) => {
  try {
    const { postId } = req.query;

    // Types or interface

    const response = await axios.get(`${process.env.API_URL}/comments`, {
      params: { postId },
    });
    res.status(200).json({ data: response.data });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

// module.exports = {
//   getComments
// }
