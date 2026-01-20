import { IsBoolean, IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../lib/constants';

/**
 * DTO for email send result
 * Returned after successfully sending an email
 */
export class EmailSendResultDto {
  @IsBoolean({ message: VALIDATION_MESSAGES.IS_BOOLEAN })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.IS_REQUIRED })
  success: boolean;

  @IsString({ message: VALIDATION_MESSAGES.IS_STRING })
  @IsOptional()
  messageId?: string;
}
