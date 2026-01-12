export const createCommentComparison = () => (prevProps, nextProps) => {
  // Returns true if props are equal (skip re-render), false if different (re-render)

  // Destructure with safe defaults
  const {
    comment: prevComment = null,
    postId: prevPostId,
    onReplySuccess: prevOnReplySuccess,
  } = prevProps || {};

  const {
    comment: nextComment = null,
    postId: nextPostId,
    onReplySuccess: nextOnReplySuccess,
  } = nextProps || {};

  // Handle null/undefined cases
  if (!prevComment || !nextComment) {
    return prevComment === nextComment; // Both null/undefined = equal, otherwise different
  }

  // Destructure comment properties with safe defaults
  const {
    id: prevId,
    body: prevBody,
    createdAt: prevCreatedAt,
    author: prevAuthor = null,
    replies: prevReplies = [],
  } = prevComment || {};

  const {
    id: nextId,
    body: nextBody,
    createdAt: nextCreatedAt,
    author: nextAuthor = null,
    replies: nextReplies = [],
  } = nextComment || {};

  // If comment IDs don't match, definitely re-render
  if (prevId !== nextId) return false;

  // Compare key properties that affect rendering
  // Return true if all properties match (skip re-render)
  return (
    prevBody === nextBody &&
    prevCreatedAt === nextCreatedAt &&
    prevAuthor?.id === nextAuthor?.id &&
    prevAuthor?.name === nextAuthor?.name &&
    prevReplies?.length === nextReplies?.length &&
    prevPostId === nextPostId &&
    prevOnReplySuccess === nextOnReplySuccess
  );
};

export const createPostComparison = () => (prevProps, nextProps) => {
  // Returns true if props are equal (skip re-render), false if different (re-render)

  // Destructure with safe defaults
  const {
    post: prevPost = null,
    variant: prevVariant,
    onView: prevOnView,
    onEdit: prevOnEdit,
    onDelete: prevOnDelete,
  } = prevProps || {};

  const {
    post: nextPost = null,
    variant: nextVariant,
    onView: nextOnView,
    onEdit: nextOnEdit,
    onDelete: nextOnDelete,
  } = nextProps || {};

  // Handle null/undefined cases
  if (!prevPost || !nextPost) {
    return prevPost === nextPost;
  }

  // Destructure post properties with safe defaults
  const {
    id: prevId,
    title: prevTitle,
    body: prevBody,
    status: prevStatus,
    createdAt: prevCreatedAt,
    image: prevImage,
    author: prevAuthor = null,
  } = prevPost || {};

  const {
    id: nextId,
    title: nextTitle,
    body: nextBody,
    status: nextStatus,
    createdAt: nextCreatedAt,
    image: nextImage,
    author: nextAuthor = null,
  } = nextPost || {};

  // If post IDs don't match, definitely re-render
  if (prevId !== nextId) return false;

  // Compare key properties that affect rendering
  // Return true if all properties match (skip re-render)
  return (
    prevTitle === nextTitle &&
    prevBody === nextBody &&
    prevStatus === nextStatus &&
    prevCreatedAt === nextCreatedAt &&
    prevImage === nextImage &&
    prevAuthor?.id === nextAuthor?.id &&
    prevAuthor?.name === nextAuthor?.name &&
    prevVariant === nextVariant &&
    prevOnView === nextOnView &&
    prevOnEdit === nextOnEdit &&
    prevOnDelete === nextOnDelete
  );
};

export const createAuthorComparison = () => (prevProps, nextProps) => {
  // Returns true if props are equal (skip re-render), false if different (re-render)

  // Destructure with safe defaults
  const {
    author: prevAuthor = null,
    size: prevSize = "md",
    className: prevClassName = "",
    fallbackBgColor: prevFallbackBgColor = "bg-blue-600",
  } = prevProps || {};

  const {
    author: nextAuthor = null,
    size: nextSize = "md",
    className: nextClassName = "",
    fallbackBgColor: nextFallbackBgColor = "bg-blue-600",
  } = nextProps || {};

  // Handle null/undefined author cases
  if (!prevAuthor || !nextAuthor) {
    return (
      prevAuthor === nextAuthor &&
      prevSize === nextSize &&
      prevClassName === nextClassName &&
      prevFallbackBgColor === nextFallbackBgColor
    );
  }

  // Destructure author properties with safe defaults
  const {
    name: prevName,
    image: prevImage,
  } = prevAuthor || {};

  const {
    name: nextName,
    image: nextImage,
  } = nextAuthor || {};

  // Compare author properties that affect rendering
  // Return true if all properties match (skip re-render)
  return (
    prevName === nextName &&
    prevImage === nextImage &&
    prevSize === nextSize &&
    prevClassName === nextClassName &&
    prevFallbackBgColor === nextFallbackBgColor
  );
};
