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
export declare const mapAuthorData: (authorData: AuthorProfile) => AuthorProfile;
/**
 * @param postData - Post data from TypeORM relation (Post entity)
 * @returns PostSummary object with id and title
 * @throws Error if postData is missing
 */
export declare const mapPostData: (postData: PostSummary) => PostSummary;
export {};
//# sourceMappingURL=mappers.d.ts.map