import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IPromptRepository, IPromptTemplateRepository } from '../../../domain/prompt/repository/prompt.repository.interface.js';
import { PROMPT_REPOSITORY, PROMPT_TEMPLATE_REPOSITORY } from '../../../domain/prompt/repository/prompt.repository.interface.js';
import { PromptDomainService } from '../../../domain/prompt/service/prompt-domain.service.js';
import { CreatePromptDto } from '../dto/create-prompt.dto.js';
import { CreatePromptTemplateDto } from '../dto/create-prompt-template.dto.js';
import { PromptEntity, PromptTemplateEntity } from '../../../domain/prompt/model/prompt.entity.js';

@Injectable()
export class PromptApplicationService {
  private readonly domainService = new PromptDomainService();

  constructor(
    @Inject(PROMPT_REPOSITORY)
    private readonly promptRepository: IPromptRepository,
    @Inject(PROMPT_TEMPLATE_REPOSITORY)
    private readonly templateRepository: IPromptTemplateRepository,
  ) {}

  async findByProjectId(projectId: string): Promise<PromptEntity[]> {
    return this.promptRepository.findByProjectId(projectId);
  }

  async findById(id: string): Promise<PromptEntity> {
    const prompt = await this.promptRepository.findById(id);
    if (!prompt) throw new NotFoundException(`Prompt ${id} not found`);
    return prompt;
  }

  async create(dto: CreatePromptDto): Promise<PromptEntity> {
    let finalPrompt = dto.userInput;

    if (dto.templateId) {
      const template = await this.templateRepository.findById(dto.templateId);
      if (template) {
        finalPrompt = this.domainService.buildFinalPrompt(template.content, dto.userInput);
      }
    }

    return this.promptRepository.create({
      projectId: dto.projectId,
      templateId: dto.templateId,
      userInput: dto.userInput,
      finalPrompt,
    });
  }

  async getTemplates(): Promise<PromptTemplateEntity[]> {
    return this.templateRepository.findActive();
  }

  async createTemplate(dto: CreatePromptTemplateDto): Promise<PromptTemplateEntity> {
    return this.templateRepository.create({
      name: dto.name,
      content: dto.content,
    });
  }
}
