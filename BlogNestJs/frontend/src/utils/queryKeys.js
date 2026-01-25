export const homePostsKeys = {
  all: ["homePosts"],
  lists: () => [...homePostsKeys.all, "list"],
  list: (page, limit, search) => [
    ...homePostsKeys.lists(),
    page,
    limit,
    search || "",
  ],
};

export const userPostsKeys = {
  all: ["userPosts"],
  lists: () => [...userPostsKeys.all, "list"],
  list: (userId, page, limit, search) => [
    ...userPostsKeys.lists(),
    userId,
    page,
    limit,
    search || "",
  ],
};

export const postDetailKeys = {
  all: ["postDetail"],
  detail: (postId) => [...postDetailKeys.all, postId],
};
