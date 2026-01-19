import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import type {
  CloudinaryUploadApiResponse,
  CloudinaryUploadApiError,
  CloudinaryUploadResult,
  CloudinaryDeletionResult,
} from '../../interfaces/cloudinaryInterface';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
      api_key: process.env.CLOUDINARY_API_KEY as string,
      api_secret: process.env.CLOUDINARY_API_SECRET as string,
    });
  }

  async deleteImage(publicId: string | null | undefined): Promise<CloudinaryDeletionResult | null> {
    if (!publicId) return null;

    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result as CloudinaryDeletionResult;
    } catch (error: unknown) {
      console.error('Error deleting image from Cloudinary:', error);
      return null;
    }
  }

  async uploadImage(
    fileBuffer: Buffer,
    folder: string = 'blog',
    originalName: string = 'image'
  ): Promise<CloudinaryUploadResult> {
    try {
      const sanitizedFolder = folder.replace(/[^a-zA-Z0-9/_-]/g, '');
      
      const timestamp = Date.now();
      const sanitizedName = originalName.replace(/[^a-zA-Z0-9._-]/g, '');
      const publicId = `${sanitizedFolder}/${timestamp}_${sanitizedName}`;

      return new Promise<CloudinaryUploadResult>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: sanitizedFolder,
            resource_type: 'image',
            public_id: publicId.split('.')[0],
          },
          (error: CloudinaryUploadApiError | undefined, result: CloudinaryUploadApiResponse | undefined) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else if (result) {
              resolve({
                secure_url: result.secure_url,
                public_id: result.public_id,
              });
            } else {
              reject(new Error('Upload completed but no result returned'));
            }
          }
        );

        uploadStream.end(fileBuffer);
      });
    } catch (error: unknown) {
      console.error('Error uploading image to Cloudinary:', error);
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
      console.error('Error extracting public_id from URL:', error);
      return null;
    }
  }
}

