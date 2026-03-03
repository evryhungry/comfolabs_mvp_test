import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateMoodboardDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @IsOptional()
  @IsString()
  combinedUrl?: string;

  @IsOptional()
  @IsString()
  characteristics?: string;
}
