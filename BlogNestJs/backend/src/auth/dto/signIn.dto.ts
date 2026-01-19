import { IsEmail, IsString, IsOptional, MinLength, ValidateIf } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @IsOptional()
  @ValidateIf((o) => !o.phone)
  email?: string;

  @IsString()
  @IsOptional()
  @ValidateIf((o) => !o.email)
  phone?: string;

  @IsString()
  @MinLength(8)
  password: string;
}

