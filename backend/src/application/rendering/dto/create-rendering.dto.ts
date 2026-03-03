import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateRenderingDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  promptId: string;
}

export class ExecuteRenderingDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  userPrompt: string;

  @IsOptional()
  @IsString()
  sketchId?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  moodboardImageIndex?: number;

  @IsOptional()
  @IsString()
  promptTemplateId?: string;
}

export interface RenderingResponseDto {
  projectId: string;
  renderedImage: string | null;
  views: string[];
  promptUsed: string;
  metadata: {
    model: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    createdAt: string;
  };
}
