import { IsString, IsOptional, IsInt, Min, MinLength, MaxLength, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCommentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  @Matches(/^[^<>]*$/, {
    message: 'Comment body contains invalid characters',
  })
  body: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  postId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  parentId?: number;
}
