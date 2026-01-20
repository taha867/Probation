import { IsString, IsOptional, Matches } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../lib/constants';

/**
 * DTO for Cloudinary upload image input
 * Note: fileBuffer validation is handled at the service level
 */
export class UploadImageDto {
  fileBuffer: Buffer;

  @IsString({ message: VALIDATION_MESSAGES.IS_STRING })
  @IsOptional()
  @Matches(/^[a-zA-Z0-9/_-]+$/, {
    message: VALIDATION_MESSAGES.FOLDER_INVALID_CHARS,
  })
  folder?: string;

  @IsString({ message: VALIDATION_MESSAGES.IS_STRING })
  @IsOptional()
  @Matches(/^[a-zA-Z0-9._-]+$/, {
    message: VALIDATION_MESSAGES.ORIGINAL_NAME_INVALID_CHARS,
  })
  originalName?: string;
}
