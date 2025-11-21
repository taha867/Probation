import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

/**
 * What this function receives:
 *   - Optional filters from req.query: title, body, sort, user.
 
 * What the function does:
 *   - Loads all posts and all comments from the external API.
 *   - Filters posts by userId if 'user' is provided.
 *   - Searches posts by title if 'title' is provided.
 *   - Searches posts by body if 'body' is provided.
 *   - Sorts posts alphabetically if 'sort' value is given.
 *   - Attaches all comments to each post.
 
 * What this function returns:
 *   - The filtered/sorted/processed list of posts with comments.
 *   - An error message if something goes wrong during the process.
 */
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

/**
 * What this function receives:
 *   - req.params.id (postId) from the URL.
 
 * What the function does:
 *   - Requests all comments of the given post from the external API.
 
 * What this function returns:
 *   - A list of comments for that specific post.
 *   - Sends an error response if the API request fails.
 */
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

/**
 * What this function receives:
 *   - req.params.id → the ID of the post to delete.
 
 * What the function does:
 *   - Sends a delete request to the external API to remove that post.
 
 * What this function returns:
 *   - A success message if the delete worked.
 *   - An error message if the deletion failed.
 */

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params; //Comes from route path parameters defined in route.

    await axios.delete(`${process.env.API_URL}/posts/${id}`);
    res.status(200).json({ message: `Post ${id} deleted successfully` });
  } catch (err) {
    return res.status(500).json({ error: "Unable to delete post" });
  }
};

/**
 * What this function receives:
 *   - req.params.id → the postId from URL.
 
 * What the function does:
 *   - Loads a single post by its ID.
 *   - Loads all comments associated with that post.
 *   - Combines both into a single formatted response.
 
 * What this function returns:
 *   - Post details along with its comments.
 *   - Error response if the post or comments could not be fetched.
 */
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

/**
 * What this function receives:
 *   - req.body containing userId, title, and body for the new post.
 
 * What the function does:
 *   - Sends a POST request to create a new post in the external API.
 
 * What this function returns:
 *   - Newly created post data.
 *   - Error response if creation fails.
 */
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

/**
 * What this function receives:
 *   - req.params.id → post ID to update.
 *   - req.body → complete updated data (userId, title, body).
 *
 * What the function does:
 *   - Performs a full update using HTTP PUT.
 *
 * What this function returns:
 *   - Updated post data.
 *   - Error response if full update fails.
 */
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
