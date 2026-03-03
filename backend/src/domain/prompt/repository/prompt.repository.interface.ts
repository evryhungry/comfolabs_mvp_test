import { PromptEntity, PromptTemplateEntity } from '../model/prompt.entity.js';

export interface IPromptRepository {
  findByProjectId(projectId: string): Promise<PromptEntity[]>;
  findById(id: string): Promise<PromptEntity | null>;
  create(prompt: Partial<PromptEntity>): Promise<PromptEntity>;
  delete(id: string): Promise<void>;
}

export interface IPromptTemplateRepository {
  findAll(): Promise<PromptTemplateEntity[]>;
  findById(id: string): Promise<PromptTemplateEntity | null>;
  findActive(): Promise<PromptTemplateEntity[]>;
  create(template: Partial<PromptTemplateEntity>): Promise<PromptTemplateEntity>;
  update(id: string, template: Partial<PromptTemplateEntity>): Promise<PromptTemplateEntity>;
}

export const PROMPT_REPOSITORY = Symbol('PROMPT_REPOSITORY');
export const PROMPT_TEMPLATE_REPOSITORY = Symbol('PROMPT_TEMPLATE_REPOSITORY');
