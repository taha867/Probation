"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cloudinary_1 = require("cloudinary");
const cloudinary_upload_payload_dto_1 = require("./dto/cloudinary-upload-payload.dto");
const upload_Image_input_dto_1 = require("./dto/upload-Image-input.dto");
const constants_1 = require("../lib/constants");
const { CLOUDINARY_DELETE_ERROR, CLOUDINARY_UPLOAD_ERROR, CLOUDINARY_UPLOAD_FAILED, CLOUDINARY_EXTRACT_ERROR, UPLOAD_NO_RESULT, } = constants_1.LOG_MESSAGES;
let CloudinaryService = class CloudinaryService {
    constructor(configService) {
        this.configService = configService;
        cloudinary_1.v2.config({
            cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
        });
    }
    async deleteImage(publicId) {
        if (!publicId)
            return null;
        try {
            const result = await cloudinary_1.v2.uploader.destroy(publicId);
            return result;
        }
        catch (error) {
            console.error(CLOUDINARY_DELETE_ERROR, error);
            return null;
        }
    }
    async uploadImage(fileBuffer, folder = constants_1.DEFAULTS.CLOUDINARY_FOLDER, originalName = constants_1.DEFAULTS.CLOUDINARY_IMAGE_NAME) {
        // Create DTO for validation (folder and originalName are validated via DTO pattern)
        const uploadDto = new upload_Image_input_dto_1.UploadImageDto();
        uploadDto.fileBuffer = fileBuffer;
        uploadDto.folder = folder || constants_1.DEFAULTS.CLOUDINARY_FOLDER;
        uploadDto.originalName = originalName || constants_1.DEFAULTS.CLOUDINARY_IMAGE_NAME;
        try {
            // Sanitization is security logic, not validation - keep it
            const sanitizedFolder = uploadDto.folder.replace(constants_1.SANITIZATION_PATTERNS.FOLDER, '');
            const timestamp = Date.now();
            const sanitizedName = uploadDto.originalName.replace(constants_1.SANITIZATION_PATTERNS.ORIGINAL_NAME, '');
            const publicId = `${sanitizedFolder}/${timestamp}_${sanitizedName}`;
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                    folder: sanitizedFolder,
                    resource_type: 'image',
                    public_id: publicId.split('.')[0],
                }, (error, result) => {
                    if (error) {
                        console.error(CLOUDINARY_UPLOAD_ERROR, error);
                        reject(error);
                    }
                    else if (result) {
                        const uploadResult = new cloudinary_upload_payload_dto_1.CloudinaryUploadResultDto();
                        uploadResult.secure_url = result.secure_url;
                        uploadResult.public_id = result.public_id;
                        resolve(uploadResult);
                    }
                    else {
                        reject(new Error(UPLOAD_NO_RESULT));
                    }
                });
                uploadStream.end(uploadDto.fileBuffer);
            });
        }
        catch (error) {
            console.error(CLOUDINARY_UPLOAD_FAILED, error);
            throw error;
        }
    }
    extractPublicIdFromUrl(url) {
        if (!url)
            return null;
        try {
            const matches = url.match(constants_1.SANITIZATION_PATTERNS.PUBLIC_ID_EXTRACT);
            if (matches && matches[1]) {
                return matches[1].replace(constants_1.SANITIZATION_PATTERNS.BLOG_PREFIX_REMOVE, '');
            }
            return null;
        }
        catch (error) {
            console.error(CLOUDINARY_EXTRACT_ERROR, error);
            return null;
        }
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map