import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryUploadResultDto } from './dto/cloudinaryUploadResult.dto';
import { CloudinaryDeletionResultDto } from './dto/cloudinaryDeletionResult.dto';
import { UploadImageDto } from './dto/uploadImage.dto';
import { LOG_MESSAGES, DEFAULTS } from '../lib/constants';

// Internal SDK types (not part of our API contract)
type CloudinaryUploadApiResponse = {
  secure_url: string;
  public_id: string;
  url?: string;
  width?: number;
  height?: number;
  format?: string;
  resource_type?: string;
  [key: string]: unknown;
};

type CloudinaryUploadApiError = Error & {
  http_code?: number;
  message: string;
  name: string;
};

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
      api_key: process.env.CLOUDINARY_API_KEY as string,
      api_secret: process.env.CLOUDINARY_API_SECRET as string,
    });
  }

  async deleteImage(
    publicId: string | null | undefined,
  ): Promise<CloudinaryDeletionResultDto | null> {
    if (!publicId) return null;

    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result as CloudinaryDeletionResultDto;
    } catch (error: unknown) {
      console.error(LOG_MESSAGES.CLOUDINARY_DELETE_ERROR, error);
      return null;
    }
  }

  async uploadImage(
    fileBuffer: Buffer,
    folder: string = DEFAULTS.CLOUDINARY_FOLDER,
    originalName: string = DEFAULTS.CLOUDINARY_IMAGE_NAME,
  ): Promise<CloudinaryUploadResultDto> {
    // Create DTO for validation (folder and originalName are validated via DTO pattern)
    const uploadDto = new UploadImageDto();
    uploadDto.fileBuffer = fileBuffer;
    uploadDto.folder = folder || DEFAULTS.CLOUDINARY_FOLDER;
    uploadDto.originalName = originalName || DEFAULTS.CLOUDINARY_IMAGE_NAME;

    try {
      // Sanitization is security logic, not validation - keep it
      const sanitizedFolder = uploadDto.folder.replace(/[^a-zA-Z0-9/_-]/g, '');

      const timestamp = Date.now();
      const sanitizedName = uploadDto.originalName.replace(
        /[^a-zA-Z0-9._-]/g,
        '',
      );
      const publicId = `${sanitizedFolder}/${timestamp}_${sanitizedName}`;

      return new Promise<CloudinaryUploadResultDto>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: sanitizedFolder,
            resource_type: 'image',
            public_id: publicId.split('.')[0],
          },
          (
            error: CloudinaryUploadApiError | undefined,
            result: CloudinaryUploadApiResponse | undefined,
          ) => {
            if (error) {
              console.error(LOG_MESSAGES.CLOUDINARY_UPLOAD_ERROR, error);
              reject(error);
            } else if (result) {
              const uploadResult = new CloudinaryUploadResultDto();
              uploadResult.secure_url = result.secure_url;
              uploadResult.public_id = result.public_id;
              resolve(uploadResult);
            } else {
              reject(new Error(LOG_MESSAGES.UPLOAD_NO_RESULT));
            }
          },
        );

        uploadStream.end(uploadDto.fileBuffer);
      });
    } catch (error: unknown) {
      console.error(LOG_MESSAGES.CLOUDINARY_UPLOAD_FAILED, error);
      throw error;
    }
  }

  extractPublicIdFromUrl(url: string | null | undefined): string | null {
    if (!url) return null;

    try {
      const matches = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
      if (matches && matches[1]) {
        return matches[1].replace(/^blog\//, '');
      }
      return null;
    } catch (error: unknown) {
      console.error(LOG_MESSAGES.CLOUDINARY_EXTRACT_ERROR, error);
      return null;
    }
  }
}
