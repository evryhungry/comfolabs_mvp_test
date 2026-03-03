import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePromptDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsOptional()
  @IsString()
  templateId?: string;

  @IsString()
  @IsNotEmpty()
  userInput: string;
}
