import axios from "axios";
import dotenv from "dotenv";
dotenv.config();


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

      res.status(200).json({data:fullUsers});
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

    res.status(200).json({data:finalUsers});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to fetch users" });
  }
};



//get all the posts of a specific user
export const getPostsOfUser = async (req, res) => {
  try {
    const { id : userId } = req.params;
    const response = await axios.get(`${process.env.API_URL}/users/${userId}/posts`);
    res.status(200).json({ data: response.data });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch all posts of user" });
  }
};