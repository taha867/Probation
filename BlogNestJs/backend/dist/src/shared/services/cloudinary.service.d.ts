import type { CloudinaryUploadResult, CloudinaryDeletionResult } from '../../interfaces/cloudinaryInterface';
export declare class CloudinaryService {
    constructor();
    deleteImage(publicId: string | null | undefined): Promise<CloudinaryDeletionResult | null>;
    uploadImage(fileBuffer: Buffer, folder?: string, originalName?: string): Promise<CloudinaryUploadResult>;
    extractPublicIdFromUrl(url: string | null | undefined): string | null;
}
//# sourceMappingURL=cloudinary.service.d.ts.map