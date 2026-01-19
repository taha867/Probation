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
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { ListUsersQueryDto } from './dto/listUsersQuery.dto';
import { GetUserPostsQueryDto } from './dto/getUserPostsQuery.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from '../common/decorators/user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { SUCCESS_MESSAGES } from '../shared/constants/constants';

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
    @Query() query: GetUserPostsQueryDto
  ) {
    return this.usersService.getUserPostsWithComments(id, query);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @User('id') userId: number,
    @UploadedFile() file?: Express.Multer.File
  ) {
    // Check if at least one field is being updated
    const hasBodyFields = Object.keys(updateUserDto).length > 0;
    const hasFileUpload = file !== undefined;

    if (!hasBodyFields && !hasFileUpload) {
      throw new BadRequestException('At least one field must be provided to update');
    }

    return this.usersService.updateUser(id, userId, updateUserDto, file);
  }

  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @User('id') userId: number
  ) {
    await this.usersService.deleteUser(id, userId);
    return {
      data: { message: SUCCESS_MESSAGES.USER_DELETED },
    };
  }
}

