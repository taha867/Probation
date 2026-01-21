import { IsBoolean, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class EmailSendResultDto {
  @IsBoolean()
  @IsNotEmpty()
  success: boolean;

  @IsString()
  @IsOptional()
  messageId?: string;
}
