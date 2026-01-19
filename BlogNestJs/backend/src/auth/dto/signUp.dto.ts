import { IsEmail, IsString, MinLength, Matches, IsOptional, IsUrl } from 'class-validator';

export class SignUpDto {
  @IsString()
  @MinLength(2)
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Name must contain only letters and spaces',
  })
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^\+?[0-9]{10,15}$/, {
    message: 'Phone number must be 10 to 15 digits',
  })
  phone: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsUrl()
  image?: string | null;
}

