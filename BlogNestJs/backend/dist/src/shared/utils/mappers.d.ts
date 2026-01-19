import type { BaseUserProfile } from "../../interfaces/userInterface";
import type { PostSummary } from "../../interfaces/postInterface";
/**
 * @param authorData - Author data from TypeORM relation (User entity)
 * @returns BaseUserProfile object
 * @throws Error if authorData is missing
 */
export declare const mapAuthorData: (authorData: BaseUserProfile) => BaseUserProfile;
/**
 * @param postData - Post data from TypeORM relation (Post entity)
 * @returns PostSummary object with id and title
 * @throws Error if postData is missing
 */
export declare const mapPostData: (postData: PostSummary) => PostSummary;
//# sourceMappingURL=mappers.d.ts.map