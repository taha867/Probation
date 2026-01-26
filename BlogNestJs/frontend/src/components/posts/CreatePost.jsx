import { useNavigate } from "react-router-dom";
import CreatePostForm from "./form/CreatePostForm.jsx";

const CreatePost = () => {
  const navigate = useNavigate();

  const handlePostCreated = () => {
    // Navigate back to dashboard after successful post creation
    navigate("/dashboard");
  };

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Create New Post</h1>
        </div>

        {/* Create Post Form */}
        <CreatePostForm onPostCreated={handlePostCreated} />
      </div>
    </div>
  );
};

export default CreatePost;
