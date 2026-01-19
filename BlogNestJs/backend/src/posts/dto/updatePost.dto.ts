import { IsString, IsEnum, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';
import { PostStatus } from '../../entities/Post';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @Matches(/^[^<>]*$/, {
    message: 'Title contains invalid characters',
  })
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  @Matches(/^[^<>]*$/, {
    message: 'Body contains invalid characters',
  })
  body?: string;

  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @IsOptional()
  @IsString()
  image?: string | null;
}

