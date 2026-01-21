import { IsString, IsUrl, IsNotEmpty } from 'class-validator';

export class CloudinaryUploadResultDto {
  @IsUrl({ require_protocol: true })
  @IsNotEmpty()
  secure_url: string;

  @IsString()
  @IsNotEmpty()
  public_id: string;
}
