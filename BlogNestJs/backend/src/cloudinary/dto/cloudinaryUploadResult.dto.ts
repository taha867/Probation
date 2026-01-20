import { IsString, IsUrl, IsNotEmpty } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../lib/constants';

/**
 * DTO for Cloudinary upload result
 * Returned after successful image upload
 */
export class CloudinaryUploadResultDto {
  @IsUrl({ require_protocol: true }, { message: VALIDATION_MESSAGES.IS_URL })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.IS_REQUIRED })
  secure_url: string;

  @IsString({ message: VALIDATION_MESSAGES.IS_STRING })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.IS_REQUIRED })
  public_id: string;
}
