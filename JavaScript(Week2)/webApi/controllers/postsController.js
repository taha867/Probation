import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

//get ,sort, filter, search from all po
export const getPosts = async (req, res) => {
  try {
    const { title, body, sort, user } = req.query; //Comes from the query string in URL (after ?) (like ?name=value)

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

      comments: comments.map((postComments) => ({
        id: postComments.id,
        postId: postComments.postId,
        name: postComments.name,
        body: postComments.body,
      })),
    }));

    res.status(200).json({ data: finalPosts });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Unable to fetch posts" });
  }
};

//get post comment by post id
export const getPostComments = async (req, res) => {
  try {
    const { id: postId } = req.params; //Comes from route path parameters defined in route. (like /users/:id)

    const response = await axios.get(
      `${process.env.API_URL}/posts/${postId}/comments`
    );
    res.status(200).json({ data: response.data });
  } catch (err) {
    return res.status(500).json({ error: "Unable to fetch post comments" });
  }
};

//delete post
export const deletePost = async (req, res) => {
  try {
    const { id: postId } = req.params; //Comes from route path parameters defined in route.
    
    await axios.delete(`${process.env.API_URL}/posts/${postId}`);
    res.status(200).json({ message: `Post ${id} deleted successfully` });
  } catch (err) {
    return res.status(500).json({ error: "Unable to delete post" });
  }
};


/*
//delete post and all its comments  by post id
export const deletePost = async (req, res) => {
  try {
    const { id: postId } = req.params;

    // Delete post
    await axios.delete(`${process.env.API_URL}/posts/${postId}`);

    // Get all comments for this post
    const commentsResponse = await axios.get(
      `${process.env.API_URL}/posts/${postId}/comments`
    );

    const comments = commentsResponse.data;

    // 3Delete each comment one by one
    for (const comment of comments) {
      await axios.delete(`${process.env.API_URL}/comments/${comment.id}`);
    }

    // 4️⃣ Final response
    return res.status(200).json({
      message: `Post ${postId} and all its comments deleted successfully`,
      deletedCommentsCount: comments.length
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Unable to delete post and comments" });
  }
};

*/

//get post by post id
export const getPostById = async (req, res) => {
  try {
    const { id: postId } = req.params; // POST ID from URL

    // Fetch the specific post
    const postResponse = await axios.get(
      `${process.env.API_URL}/posts/${postId}`
    );

    // Fetch comments for that post
    const commentsResponse = await axios.get(
      `${process.env.API_URL}/posts/${postId}/comments`
    );

    const post = postResponse.data;
    const comments = commentsResponse.data;

    // Prepare final response
    const finalPost = {
      id: post.id,
      userId: post.userId,
      title: post.title,
      body: post.body,
      comments: comments.map((postComments) => ({
        id: postComments.id,
        postId: postComments.postId,
        name: postComments.name,
        body: postComments.body,
      })),
    };

    res.status(200).json({ data: finalPost });
  } catch (err) {
    return res.status(500).json({ error: "Unable to fetch post" });
  }
};

//create a new post post
export const createPost = async (req, res) => {
  try {
    const { userId, title, body } = req.body;

    const response = await axios.post(`${process.env.API_URL}/posts`, {
      userId,
      title,
      body,
    });

    return res.status(200).json({ data: response.data });
  } catch (err) {
    return res.status(500).json({ error: "Failed to create post" });
  }
};

//UPDATE FULL POST
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, title, body } = req.body;

    const response = await axios.put(`${process.env.API_URL}/posts/${id}`, {
      userId,
      title,
      body,
    });

    return res.status(200).json({ data: response.data });
  } catch (err) {
    return res.status(500).json({ error: "Failed to update post" });
  }
};

//  PARTIAL UPDATE
export const patchPost = async (req, res) => {
  try {
    const { id: postId } = req.params;

    const response = await axios.patch(
      `${process.env.API_URL}/posts/${postId}`,
      req.body
    );

    return res.status(200).json({ data: response.data });
  } catch (err) {
    return res.status(500).json({ error: "Failed to update post partially" });
  }
};
