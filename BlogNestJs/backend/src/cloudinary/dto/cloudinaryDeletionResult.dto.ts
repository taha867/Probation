import { IsString, IsIn, IsNotEmpty } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../lib/constants';

/**
 * DTO for Cloudinary deletion result
 * Returned after image deletion from Cloudinary
 */
export class CloudinaryDeletionResultDto {
  @IsString({ message: VALIDATION_MESSAGES.IS_STRING })
  @IsIn(['ok', 'not found'], {
    message: VALIDATION_MESSAGES.RESULT_INVALID_VALUE,
  })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.IS_REQUIRED })
  result: string;
}
