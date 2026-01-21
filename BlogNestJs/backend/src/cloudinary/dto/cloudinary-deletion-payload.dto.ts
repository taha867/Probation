import { IsString, IsIn, IsNotEmpty } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../lib/constants';
const { RESULT_INVALID_VALUE } = VALIDATION_MESSAGES;

export class CloudinaryDeletionResultDto {
  @IsString()
  @IsIn(['ok', 'not found'], {
    message: RESULT_INVALID_VALUE,
  })
  @IsNotEmpty()
  result: string;
}
