import * as yup from "yup";
import { VALIDATION_MESSAGES } from "../utils/constants";
import { baseTextSchema } from "./commonSchemas";

const { COMMENT_REQUIRED, COMMENT_TOO_SHORT, COMMENT_TOO_LONG } =
  VALIDATION_MESSAGES;

/**
 * Comment Form Validation Schema
 */
export const commentSchema = yup.object({
  body: baseTextSchema
    .required(COMMENT_REQUIRED)
    .min(1, COMMENT_TOO_SHORT)
    .max(2000, COMMENT_TOO_LONG),
});
