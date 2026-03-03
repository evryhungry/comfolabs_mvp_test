import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSketchDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
