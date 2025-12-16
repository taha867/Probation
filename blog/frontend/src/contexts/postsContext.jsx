/**
 * Posts Context - Centralized state management for posts
 * Following React 19 best practices with useReducer and context
 */
import { createContext, useReducer, useContext, useMemo } from "react";
import { postsReducer, initialPostsState } from "../reducers/postReducer";

// Context
const PostsContext = createContext(null);

/**
 * Posts Provider component
 */
export const PostsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(postsReducer, initialPostsState);

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
