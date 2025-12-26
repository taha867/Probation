/**
 * PostDetailPage - Page component for displaying a single post
 * Thin wrapper that delegates to PostContainer for all logic
 * Follows React 19 best practices with proper separation of concerns
 */
import PostContainer from "../containers/PostContainer";

const PostDetailPage = () => {
  return <PostContainer />;
};

export default PostDetailPage;

