import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'; // Interceptor built on Multer, Handles file uploads
import { UsersService } from './users.service';
import { ListUsersQueryDto } from './dto/list-users-query-payload.dto';
import { GetUserPostsQueryDto } from './dto/user-posts-query-input.dto';
import { UpdateUserDto } from './dto/update-user-input.dto';
import { User } from '../customDecorators/user.decorator';
import { Public } from '../customDecorators/public.decorator';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../lib/constants';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @Get()
  async list(@Query() query: ListUsersQueryDto) {
    return this.usersService.listUsers(query);
  }

  @Get('me')
  async getCurrentUser(@User('id') userId: number) {
    return this.usersService.findUserById(userId);
  }

  @Public()
  @Get(':id/posts')
  async getUserPosts(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: GetUserPostsQueryDto,
  ) {
    return this.usersService.getUserPostsWithComments(id, query);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image')) // Configures Multer to extract a file from the image field in multipart/form-data
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @User('id') userId: number,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    // Check if at least one field is being updated
    const hasBodyFields = Object.keys(updateUserDto).length > 0;
    const hasFileUpload = file !== undefined;

    if (!hasBodyFields && !hasFileUpload) {
      throw new BadRequestException(ERROR_MESSAGES.AT_LEAST_ONE_FIELD_REQUIRED);
    }

    return this.usersService.updateUser(id, userId, updateUserDto, file);
  }

  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @User('id') userId: number,
  ) {
    await this.usersService.deleteUser(id, userId);
    return {
      data: { message: SUCCESS_MESSAGES.USER_DELETED },
    };
  }
}
