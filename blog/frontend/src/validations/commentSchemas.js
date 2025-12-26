/**
 * Yup validation schemas for comment forms
 */
import * as yup from "yup";
import { VALIDATION_MESSAGES } from "../utils/constants";

/**
 * Comment Form Validation Schema
 */
export const commentSchema = yup.object({
  body: yup
    .string()
    .required(VALIDATION_MESSAGES.COMMENT_REQUIRED)
    .trim()
    .min(1, VALIDATION_MESSAGES.COMMENT_TOO_SHORT)
    .max(2000, VALIDATION_MESSAGES.COMMENT_TOO_LONG),
});

