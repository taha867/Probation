import { CloudinaryUploadResultDto } from "./dto/cloudinary-upload-payload.dto";
import { CloudinaryDeletionResultDto } from "./dto/cloudinary-deletion-payload.dto";
export declare class CloudinaryService {
    private readonly config;
    constructor();
    deleteImage(publicId: string | null | undefined): Promise<CloudinaryDeletionResultDto | null>;
    uploadImage(fileBuffer: Buffer, folder?: string, // Default folder
    originalName?: string): Promise<CloudinaryUploadResultDto>;
    extractPublicIdFromUrl(url: string | null | undefined): string | null;
}
//# sourceMappingURL=cloudinary.service.d.ts.map