import { Injectable } from "@nestjs/common";
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from "cloudinary";
import { CloudinaryUploadResultDto } from "./dto/cloudinary-upload-payload.dto";
import { CloudinaryDeletionResultDto } from "./dto/cloudinary-deletion-payload.dto";
import { UploadImageDto } from "./dto/upload-Image-input.dto";
import {
  LOG_MESSAGES,
  DEFAULTS,
  SANITIZATION_PATTERNS,
} from "../lib/constants";
import appConfig from "../config/config";

const {
  CLOUDINARY_DELETE_ERROR,
  CLOUDINARY_UPLOAD_ERROR,
  CLOUDINARY_UPLOAD_FAILED,
  CLOUDINARY_EXTRACT_ERROR,
  UPLOAD_NO_RESULT,
} = LOG_MESSAGES;

@Injectable()
export class CloudinaryService {
  private readonly config = appConfig();

  constructor() {
    cloudinary.config({
      cloud_name: this.config.cloudinary.cloudName,
      api_key: this.config.cloudinary.apiKey,
      api_secret: this.config.cloudinary.apiSecret,
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
      console.error(CLOUDINARY_DELETE_ERROR, error);
      return null;
    }
  }

  async uploadImage(
    fileBuffer: Buffer,
    folder: string = DEFAULTS.CLOUDINARY_FOLDER, // Default folder
    originalName: string = DEFAULTS.CLOUDINARY_IMAGE_NAME, // Default original name picture
  ): Promise<CloudinaryUploadResultDto> {
    // Create DTO for validation (folder and originalName are validated via DTO pattern)
    const uploadDto = new UploadImageDto();
    uploadDto.fileBuffer = fileBuffer;
    uploadDto.folder = folder || DEFAULTS.CLOUDINARY_FOLDER;
    uploadDto.originalName = originalName || DEFAULTS.CLOUDINARY_IMAGE_NAME;

    try {
      const sanitizedFolder = uploadDto.folder.replace(
        SANITIZATION_PATTERNS.FOLDER,
        "",
      );

      const timestamp = Date.now();
      const sanitizedName = uploadDto.originalName.replace(
        SANITIZATION_PATTERNS.ORIGINAL_NAME,
        "",
      );
      const publicId = `${sanitizedFolder}/${timestamp}_${sanitizedName}`;

      return new Promise<CloudinaryUploadResultDto>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: sanitizedFolder,
            resource_type: "image",
            public_id: publicId.split(".")[0], //removes file extension
          },
          (
            error: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined,
          ) => {
            if (error) {
              console.error(CLOUDINARY_UPLOAD_ERROR, error);
              reject(error);
            } else if (result) {
              const uploadResult = new CloudinaryUploadResultDto();
              uploadResult.secure_url = result.secure_url;
              uploadResult.public_id = result.public_id;
              resolve(uploadResult);
            } else {
              reject(new Error(UPLOAD_NO_RESULT));
            }
          },
        );

        uploadStream.end(uploadDto.fileBuffer);
      });
    } catch (error: unknown) {
      console.error(CLOUDINARY_UPLOAD_FAILED, error);
      throw error;
    }
  }

  extractPublicIdFromUrl(url: string | null | undefined): string | null {
    if (!url) return null;

    try {
      const matches = url.match(SANITIZATION_PATTERNS.PUBLIC_ID_EXTRACT);
      if (matches && matches[1]) {
        return matches[1].replace(SANITIZATION_PATTERNS.BLOG_PREFIX_REMOVE, "");
      }
      return null;
    } catch (error: unknown) {
      console.error(CLOUDINARY_EXTRACT_ERROR, error);
      return null;
    }
  }
}
