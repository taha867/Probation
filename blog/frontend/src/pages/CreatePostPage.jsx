/**
 * CreatePostPage - Dedicated page for creating new posts
 * Provides focused environment for post creation
 */
import { PostsProvider } from "../contexts/postsContext";
import CreatePost from "../components/posts/CreatePost.jsx";

const CreatePostPage = () => {
  return (
    <PostsProvider>
      <CreatePost />
    </PostsProvider>
  );
};

export default CreatePostPage;
