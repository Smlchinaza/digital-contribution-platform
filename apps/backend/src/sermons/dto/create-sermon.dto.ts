import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateSermonDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  preacher: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsOptional()
  duration?: string;
}
