/**
 * Author profile type - minimal user data for post/comment authors
 */
type AuthorProfile = {
  id: number;
  name: string;
  email: string;
  image: string | null;
};

/**
 * Post summary type - minimal post data for relations
 */
type PostSummary = {
  id: number;
  title: string;
};

/**
 * @param authorData - Author data from TypeORM relation (User entity)
 * @returns AuthorProfile object
 * @throws Error if authorData is missing
 */
export const mapAuthorData = (authorData: AuthorProfile): AuthorProfile => {
  if (!authorData) {
    throw new Error(
      'Author data missing - TypeORM relation may be misconfigured',
    );
  }
  const { id, name, email, image } = authorData;
  return {
    id,
    name,
    email,
    image: image || null,
  };
};

/**
 * @param postData - Post data from TypeORM relation (Post entity)
 * @returns PostSummary object with id and title
 * @throws Error if postData is missing
 */
export const mapPostData = (postData: PostSummary): PostSummary => {
  if (!postData) {
    throw new Error(
      'Post data missing - TypeORM relation may be misconfigured',
    );
  }
  const { id, title } = postData;
  return {
    id,
    title,
  };
};
