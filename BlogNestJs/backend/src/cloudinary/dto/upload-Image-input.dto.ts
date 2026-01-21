import { IsString, IsOptional, Matches } from 'class-validator';
import { VALIDATION_MESSAGES, VALIDATION_PATTERNS } from '../../lib/constants';

const { FOLDER_INVALID_CHARS, ORIGINAL_NAME_INVALID_CHARS } =
  VALIDATION_MESSAGES;
const { FOLDER, ORIGINAL_NAME } = VALIDATION_PATTERNS;

export class UploadImageDto {
  fileBuffer: Buffer;

  @IsString()
  @IsOptional()
  @Matches(FOLDER, {
    message: FOLDER_INVALID_CHARS,
  })
  folder?: string;

  @IsString()
  @IsOptional()
  @Matches(ORIGINAL_NAME, {
    message: ORIGINAL_NAME_INVALID_CHARS,
  })
  originalName?: string;
}
