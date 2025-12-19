/**
 * EmptyPostsState - Presentational component for empty list state
 * Single responsibility: show appropriate message based on search query.
 */
const EmptyPostsState = ({ searchQuery }) => {
  return (
    <div className="text-center py-8 text-muted-foreground">
      {searchQuery
        ? "No posts found matching your search."
        : "No posts yet. Create your first post!"}
    </div>
  );
};

export default EmptyPostsState;


