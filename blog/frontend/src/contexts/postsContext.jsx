/**
 * Posts Context - Centralized state management for posts
 */
import { createContext, useReducer, useContext, useMemo, use } from "react";
import { postsReducer, initialPostsState } from "../reducers/postReducer";
import { createInitialPostsPromise } from "../utils/postsPromise";
import { useAuthContext } from "./authContext";

// Context
const PostsContext = createContext(null);

/**
 * Posts Provider component with Suspense integration
 * Uses use() hook for initial data loading
 */
export const PostsProvider = ({ children }) => {
  const { state: {user} ={} } = useAuthContext();

  // This will suspend the component until posts data is resolved
  const initialPostsData = use(createInitialPostsPromise(user?.id));

  const {posts, pagination} = initialPostsData;
  // Create initial state with resolved posts data
  const initialStateWithData = {
    ...initialPostsState,
    posts,
    pagination
  };

  const [state, dispatch] = useReducer(postsReducer, initialStateWithData);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state, dispatch],
  );

  return (
    <PostsContext.Provider value={contextValue}>
      {children}
    </PostsContext.Provider>
  );
};

/**
 * Hook to access posts context
 */
export const usePostsContext = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error("usePostsContext must be used within a PostsProvider");
  }
  return context;
};
