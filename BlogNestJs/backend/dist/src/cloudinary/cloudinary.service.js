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
const cloudinary_1 = require("cloudinary");
const cloudinaryUploadResult_dto_1 = require("./dto/cloudinaryUploadResult.dto");
const uploadImage_dto_1 = require("./dto/uploadImage.dto");
const constants_1 = require("../lib/constants");
let CloudinaryService = class CloudinaryService {
    constructor() {
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
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
            console.error(constants_1.LOG_MESSAGES.CLOUDINARY_DELETE_ERROR, error);
            return null;
        }
    }
    async uploadImage(fileBuffer, folder = constants_1.DEFAULTS.CLOUDINARY_FOLDER, originalName = constants_1.DEFAULTS.CLOUDINARY_IMAGE_NAME) {
        // Create DTO for validation (folder and originalName are validated via DTO pattern)
        const uploadDto = new uploadImage_dto_1.UploadImageDto();
        uploadDto.fileBuffer = fileBuffer;
        uploadDto.folder = folder || constants_1.DEFAULTS.CLOUDINARY_FOLDER;
        uploadDto.originalName = originalName || constants_1.DEFAULTS.CLOUDINARY_IMAGE_NAME;
        try {
            // Sanitization is security logic, not validation - keep it
            const sanitizedFolder = uploadDto.folder.replace(/[^a-zA-Z0-9/_-]/g, '');
            const timestamp = Date.now();
            const sanitizedName = uploadDto.originalName.replace(/[^a-zA-Z0-9._-]/g, '');
            const publicId = `${sanitizedFolder}/${timestamp}_${sanitizedName}`;
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                    folder: sanitizedFolder,
                    resource_type: 'image',
                    public_id: publicId.split('.')[0],
                }, (error, result) => {
                    if (error) {
                        console.error(constants_1.LOG_MESSAGES.CLOUDINARY_UPLOAD_ERROR, error);
                        reject(error);
                    }
                    else if (result) {
                        const uploadResult = new cloudinaryUploadResult_dto_1.CloudinaryUploadResultDto();
                        uploadResult.secure_url = result.secure_url;
                        uploadResult.public_id = result.public_id;
                        resolve(uploadResult);
                    }
                    else {
                        reject(new Error(constants_1.LOG_MESSAGES.UPLOAD_NO_RESULT));
                    }
                });
                uploadStream.end(uploadDto.fileBuffer);
            });
        }
        catch (error) {
            console.error(constants_1.LOG_MESSAGES.CLOUDINARY_UPLOAD_FAILED, error);
            throw error;
        }
    }
    extractPublicIdFromUrl(url) {
        if (!url)
            return null;
        try {
            const matches = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
            if (matches && matches[1]) {
                return matches[1].replace(/^blog\//, '');
            }
            return null;
        }
        catch (error) {
            console.error(constants_1.LOG_MESSAGES.CLOUDINARY_EXTRACT_ERROR, error);
            return null;
        }
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map