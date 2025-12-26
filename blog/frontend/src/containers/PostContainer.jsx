/**
 * PostContainer - Container component for post detail page
 * Handles all business logic, data fetching, and state management
 * Follows React 19 best practices with proper separation of concerns
 */
import { useParams } from "react-router-dom";
import PostDetailContent from "../components/posts/PostDetailContent";
import CommentSection from "../components/comments/CommentSection";
import { postIdParamSchema } from "../validations/postSchemas";

const PostContainer = () => {
  const { id } = useParams();

  // Validate post ID using validation schema
  let postId;
  try {
    postIdParamSchema.validateSync(id);
    // After validation succeeds, parse to number
    postId = parseInt(id, 10);
  } catch (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center py-12">
          <p className="text-gray-500">Invalid post ID.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Post Content */}
        <PostDetailContent postId={postId} />

        {/* Comments Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <CommentSection postId={postId} />
        </div>
      </div>
    </div>
  );
};

export default PostContainer;

