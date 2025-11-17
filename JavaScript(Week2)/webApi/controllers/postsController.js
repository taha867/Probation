// controllers/postsController.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();


//get ,sort, filter, search from all posts
export const getPosts = async (req, res) => {
  try {
    const { title, body, sort, user } = req.query; //Comes from the query string in URL (after ?)

    const postsResponse = await axios.get(`${process.env.API_URL}/posts`);
    const commentsResponse = await axios.get(`${process.env.API_URL}/comments`);

    let posts = postsResponse.data;
    const comments = commentsResponse.data;

    // FILTER BY USER ID
    if (user) {
      posts = posts.filter((post) => String(post.userId) === String(user));
    }

    // SEARCH BY TITLE
    if (title) {
      const t = title.toLowerCase();
      posts = posts.filter((p) => p.title.toLowerCase().includes(t));
    }

    // SEARCH BY BODY
    if (body) {
      const b = body.toLowerCase();
      posts = posts.filter((p) =>
        p.body.toLowerCase().replace(/\n/g, " ").includes(b)
      );
    }

    // SORTING BY TITLE
    // sort=1 → ascending   (A → Z)
    // sort=2 → descending  (Z → A)
    if (sort) {
      posts = posts.sort((a, b) => {
        if (String(sort) === "1") {
          return a.title.localeCompare(b.title);
        } else if (String(sort) === "2") {
          return b.title.localeCompare(a.title);
        }
        return 0;
      });
    }

    // ATTACH COMMENTS
    const finalPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      body: post.body,
      userId: post.userId,

      comments: comments
        .filter((c) => c.postId === post.id)
        .map((c) => ({
          postId: c.postId,
          id: c.id,
          name: c.name,
          body: c.body,
        })),
    }));

    return res.json(finalPosts);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Unable to fetch posts" });
  }
};


//get post comment sby post id
export const getPostComments = async (req, res) => {
  try {
    const { id } = req.params; //Comes from route path parameters defined in route.

    const response = await axios.get(
      `${process.env.API_URL}/posts/${id}/comments`
    );
    return res.json(response.data);
  } catch (err) {
    return res.status(500).json({ error: "Unable to fetch post comments" });
  }
};

//delete post by post id
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params; //Comes from route path parameters defined in route.

    await axios.delete(`${process.env.API_URL}/posts/${id}`);
    await axios.delete(`${process.env.API_URL}/comments/${id}`);

    return res.json({ message: `Post ${id} deleted successfully` });
  } catch (err) {
    return res.status(500).json({ error: "Unable to delete post" });
  }
};

//get post by post id
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params; // POST ID from URL

    // Fetch the specific post
    const postResponse = await axios.get(`${process.env.API_URL}/posts/${id}`);

    // Fetch comments for that post
    const commentsResponse = await axios.get(
      `${process.env.API_URL}/posts/${id}/comments`
    );

    const post = postResponse.data;
    const comments = commentsResponse.data;

    // Prepare final response
    const finalPost = {
      id: post.id,
      userId: post.userId,
      title: post.title,
      body: post.body,
      comments: comments.map((c) => ({
        id: c.id,
        postId: c.postId,
        name: c.name,
        body: c.body,
      })),
    };

    return res.json(finalPost);

  } catch (err) {
    return res.status(500).json({ error: "Unable to fetch post" });
  }
};
