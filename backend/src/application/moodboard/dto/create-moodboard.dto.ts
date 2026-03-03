import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMoodboardDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsArray()
  @IsString({ each: true })
  imageUrls: string[];

  @IsOptional()
  @IsString()
  characteristics?: string;
}
