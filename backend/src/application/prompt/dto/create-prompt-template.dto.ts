import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePromptTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
