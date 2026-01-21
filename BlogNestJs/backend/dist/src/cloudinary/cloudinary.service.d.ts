import { ConfigService } from '@nestjs/config';
import { CloudinaryUploadResultDto } from './dto/cloudinary-upload-payload.dto';
import { CloudinaryDeletionResultDto } from './dto/cloudinary-deletion-payload.dto';
export declare class CloudinaryService {
    private readonly configService;
    constructor(configService: ConfigService);
    deleteImage(publicId: string | null | undefined): Promise<CloudinaryDeletionResultDto | null>;
    uploadImage(fileBuffer: Buffer, folder?: string, originalName?: string): Promise<CloudinaryUploadResultDto>;
    extractPublicIdFromUrl(url: string | null | undefined): string | null;
}
//# sourceMappingURL=cloudinary.service.d.ts.map