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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user-entity/user.entity");
const post_entity_1 = require("../posts/post-entity/post.entity");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const pagination_service_1 = require("../pagination/pagination.service");
const app_exception_1 = require("../common/exceptions/app.exception");
const constants_1 = require("../lib/constants");
const { USER_NOT_FOUND, CANNOT_UPDATE_OTHER_USER, CANNOT_DELETE_OTHER_USER } = constants_1.ERROR_MESSAGES;
let UsersService = class UsersService {
    constructor(userRepository, postRepository, cloudinaryService, paginationService) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.cloudinaryService = cloudinaryService;
        this.paginationService = paginationService;
    }
    async listUsers(query) {
        const { page, limit } = query;
        const paginatedResult = await this.paginationService.paginateRepository(this.userRepository, {
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                status: true,
                image: true,
            },
            order: { createdAt: "DESC" },
        }, page, limit);
        const { data: { items, paginationOptions }, } = paginatedResult;
        return {
            data: {
                users: items,
                paginationOptions,
            },
        };
    }
    async findUserById(id) {
        const user = await this.userRepository.findOne({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                image: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(USER_NOT_FOUND);
        }
        const { name, email, phone, image } = user;
        return {
            data: {
                user: {
                    id: user.id,
                    name,
                    email,
                    phone,
                    image,
                },
            },
        };
    }
    async getUserPostsWithComments(userId, query) {
        const { page, limit, search, status } = query;
        const user = await this.userRepository.findOne({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(USER_NOT_FOUND);
        }
        const qb = this.postRepository
            .createQueryBuilder("post")
            .leftJoinAndSelect("post.author", "author")
            .where("post.userId = :userId", { userId });
        if (status) {
            qb.andWhere("post.status = :status", { status });
        }
        if (search) {
            qb.andWhere(new typeorm_2.Brackets((qb) => {
                qb.where("post.title ILIKE :search", {
                    search: `%${search}%`,
                }).orWhere("post.body ILIKE :search", { search: `%${search}%` });
            }));
        }
        qb.orderBy("post.createdAt", "DESC");
        const paginatedResult = await this.paginationService.paginateQueryBuilder(qb, page, limit);
        const { id, name, email, image } = user;
        const { data: { items, paginationOptions }, } = paginatedResult;
        return {
            data: {
                id,
                name,
                email,
                image,
                posts: items,
                paginationOptions,
            },
        };
    }
    async updateUser(requestedUserId, authUserId, updateUserDto, file) {
        // Authorization check
        if (requestedUserId !== authUserId) {
            throw new common_1.ForbiddenException(CANNOT_UPDATE_OTHER_USER);
        }
        const user = await this.userRepository.findOne({
            where: { id: requestedUserId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                password: true,
                image: true,
                imagePublicId: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(USER_NOT_FOUND);
        }
        const { name, email, phone, password, image } = updateUserDto;
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (email !== undefined) {
            const emailExists = await this.userRepository.exists({
                where: { email, id: (0, typeorm_2.Not)(requestedUserId) },
            });
            if (emailExists) {
                throw new app_exception_1.AppException("EMAIL_ALREADY_EXISTS", common_1.HttpStatus.UNPROCESSABLE_ENTITY);
            }
            updateData.email = email;
        }
        if (phone !== undefined) {
            if (phone !== null) {
                const phoneExists = await this.userRepository.exists({
                    where: { phone, id: (0, typeorm_2.Not)(requestedUserId) },
                });
                if (phoneExists) {
                    throw new app_exception_1.AppException("PHONE_ALREADY_EXISTS", common_1.HttpStatus.UNPROCESSABLE_ENTITY);
                }
            }
            updateData.phone = phone;
        }
        if (password !== undefined) {
            // Password will be automatically hashed by UserSubscriber before update
            updateData.password = password;
        }
        // Handle image upload/removal
        if (file) {
            // New image uploaded: delete old image, upload new one
            if (user.imagePublicId) {
                await this.cloudinaryService.deleteImage(user.imagePublicId);
            }
            const uploadResult = await this.cloudinaryService.uploadImage(file.buffer, constants_1.DEFAULTS.CLOUDINARY_USERS_FOLDER, file.originalname || constants_1.DEFAULTS.CLOUDINARY_PROFILE_IMAGE_NAME);
            updateData.image = uploadResult.secure_url;
            updateData.imagePublicId = uploadResult.public_id;
        }
        else if (image === null || image === "") {
            // Image explicitly removed
            if (user.imagePublicId) {
                await this.cloudinaryService.deleteImage(user.imagePublicId);
            }
            updateData.image = null;
            updateData.imagePublicId = null;
        }
        // Update user
        Object.assign(user, updateData);
        await this.userRepository.save(user);
        // Fetch updated user
        const updatedUser = await this.userRepository.findOne({
            where: { id: requestedUserId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                status: true,
                image: true,
            },
        });
        if (!updatedUser) {
            throw new app_exception_1.AppException("USER_UPDATE_FAILED", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const { id, name: updatedName, email: updatedEmail, phone: updatedPhone, status, image: updatedImage, } = updatedUser;
        return {
            data: {
                message: constants_1.SUCCESS_MESSAGES.USER_UPDATED,
                user: {
                    id,
                    name: updatedName,
                    email: updatedEmail,
                    phone: updatedPhone,
                    status,
                    image: updatedImage,
                },
            },
        };
    }
    async deleteUser(requestedUserId, authUserId) {
        // Authorization check
        if (requestedUserId !== authUserId) {
            throw new common_1.ForbiddenException(CANNOT_DELETE_OTHER_USER);
        }
        const user = await this.userRepository.findOne({
            where: { id: requestedUserId },
            select: {
                id: true,
                imagePublicId: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(USER_NOT_FOUND);
        }
        // Delete associated image from Cloudinary
        if (user.imagePublicId) {
            await this.cloudinaryService.deleteImage(user.imagePublicId);
        }
        // Delete user (cascade will delete posts and comments)
        await this.userRepository.delete(requestedUserId);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)() //design pattern
    ,
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        cloudinary_service_1.CloudinaryService,
        pagination_service_1.PaginationService])
], UsersService);
//# sourceMappingURL=users.service.js.map