import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSinhVienDto {
  @IsString()
  @IsNotEmpty()
  MaSV: string;

  @IsString()
  @IsNotEmpty()
  hoTen: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  lop?: string;

  @IsOptional()
  @IsString()
  password?: string;
}
