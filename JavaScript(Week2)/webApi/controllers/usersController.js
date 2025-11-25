import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

/**
 * What this function receives:
 *   - It can optionally receive a `zip` value in req.query (example: /users?zip=12345).
 
 * Business Logic:
 *   - It first loads all users and all comments from the external API.
 *   - If no zip is given, it attaches matching comments to every user.
 *   - If a zip is provided, it filters users by that zip and then adds their comments.
 
 * Response:
 *   - Returns users with their comments.
 *   - Sends an error message if anything goes wrong.
 */
export const getUsers = async (req, res) => {
  try {
    const { zip } = req.query; //Comes from the query string in URL (after ?)

    // Fetch users and comments
    const usersResponse = await axios.get(`${process.env.API_URL}/users`);
    const commentsResponse = await axios.get(`${process.env.API_URL}/comments`);

    let users = usersResponse.data;
    const comments = commentsResponse.data;

    // If no ZIP provided → return full users with comments
    if (!zip) {
      const fullUsers = users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,

        comments: comments.filter(
          (c) => c.email.toLowerCase() === user.email.toLowerCase()
        ),
      }));

      res.status(200).json({ data: fullUsers });
    }

    // If ZIP is provided → filter users by ZIP
    users = users.filter((user) => user.address.zipcode === zip);

    // Final formatted users
    const finalUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      address: {
        zip: user.address.zipcode,
      },
      comments: comments.filter(
        (c) => c.email.toLowerCase() === user.email.toLowerCase()
      ),
    }));

    res.status(200).json({ data: finalUsers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to fetch users" });
  }
};

/**
 * What this function receives:
 *   - A user ID from req.params (example: /users/5/posts → userId = 5).
 
 * Business Logic:
 *   - It sends a request to the API and asks for all posts written by that user.
 
 * Response:
 *   - Sends back the list of posts for that user.
 *   - Returns an error message if the API request fails.
 */
export const getPostsOfUser = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const response = await axios.get(
      `${process.env.API_URL}/users/${userId}/posts`
    );
    res.status(200).json({ data: response.data });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch all posts of user" });
  }
};
