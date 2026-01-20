import { CloudinaryUploadResultDto } from './dto/cloudinaryUploadResult.dto';
import { CloudinaryDeletionResultDto } from './dto/cloudinaryDeletionResult.dto';
export declare class CloudinaryService {
    constructor();
    deleteImage(publicId: string | null | undefined): Promise<CloudinaryDeletionResultDto | null>;
    uploadImage(fileBuffer: Buffer, folder?: string, originalName?: string): Promise<CloudinaryUploadResultDto>;
    extractPublicIdFromUrl(url: string | null | undefined): string | null;
}
//# sourceMappingURL=cloudinary.service.d.ts.map