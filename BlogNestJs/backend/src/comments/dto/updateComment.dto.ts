import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  @Matches(/^[^<>]*$/, {
    message: 'Comment body contains invalid characters',
  })
  body: string;
}

