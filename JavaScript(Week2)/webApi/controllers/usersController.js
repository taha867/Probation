import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// GET /users?zip=12345
export const getUsers = async (req, res) => {
  try {
    const { zip } = req.query;

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

      return res.json(fullUsers);
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

    return res.json(finalUsers);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to fetch users" });
  }
};
