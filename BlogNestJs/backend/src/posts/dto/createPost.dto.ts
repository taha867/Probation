import { IsString, IsEnum, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';
import { PostStatus } from '../../entities/Post';

export class CreatePostDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @Matches(/^[^<>]*$/, {
    message: 'Title contains invalid characters',
  })
  title: string;

  @IsString()
  @MinLength(1)
  @Matches(/^[^<>]*$/, {
    message: 'Body contains invalid characters',
  })
  body: string;

  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus = PostStatus.DRAFT;
}

