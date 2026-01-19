"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapPostData = exports.mapAuthorData = void 0;
/**
 * @param authorData - Author data from TypeORM relation (User entity)
 * @returns BaseUserProfile object
 * @throws Error if authorData is missing
 */
const mapAuthorData = (authorData) => {
    if (!authorData) {
        throw new Error("Author data missing - TypeORM relation may be misconfigured");
    }
    const { id, name, email, image } = authorData;
    return {
        id,
        name,
        email,
        image: image || null,
    };
};
exports.mapAuthorData = mapAuthorData;
/**
 * @param postData - Post data from TypeORM relation (Post entity)
 * @returns PostSummary object with id and title
 * @throws Error if postData is missing
 */
const mapPostData = (postData) => {
    if (!postData) {
        throw new Error("Post data missing - TypeORM relation may be misconfigured");
    }
    const { id, title } = postData;
    return {
        id,
        title,
    };
};
exports.mapPostData = mapPostData;
//# sourceMappingURL=mappers.js.map