import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsString, IsNumber } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(3)
  fullName: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  // Optional profile fields
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  dob?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  nextOfKin?: string;

  @IsOptional()
  @IsString()
  nextOfKinPhone?: string;

  // Optional bank fields
  @IsOptional()
  @IsString()
  bankName?: string;

  @IsOptional()
  @IsString()
  accountNumber?: string;

  @IsOptional()
  @IsString()
  accountName?: string;

  @IsOptional()
  @IsString()
  nin?: string;

  // Optional contribution preferences
  @IsOptional()
  @IsNumber()
  contributionAmount?: number;

  @IsOptional()
  @IsString()
  frequency?: string;

  @IsOptional()
  @IsString()
  startDate?: string;
}


