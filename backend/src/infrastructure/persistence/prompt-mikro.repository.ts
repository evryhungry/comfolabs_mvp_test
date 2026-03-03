import { Injectable } from '@nestjs/common';
import { EntityManager, QueryOrder } from '@mikro-orm/mysql';
import {
  IPromptRepository,
  IPromptTemplateRepository,
} from '../../domain/prompt/repository/prompt.repository.interface.js';
import { PromptEntity, PromptTemplateEntity } from '../../domain/prompt/model/prompt.entity.js';

@Injectable()
export class PromptMikroRepository implements IPromptRepository {
  constructor(private readonly em: EntityManager) {}

  async findByProjectId(projectId: string): Promise<PromptEntity[]> {
    return this.em.find(PromptEntity, { projectId }, { orderBy: { createdAt: QueryOrder.DESC } });
  }

  async findById(id: string): Promise<PromptEntity | null> {
    return this.em.findOne(PromptEntity, { id });
  }

  async create(data: Partial<PromptEntity>): Promise<PromptEntity> {
    const prompt = new PromptEntity(data);
    await this.em.persistAndFlush(prompt);
    return prompt;
  }

  async delete(id: string): Promise<void> {
    const prompt = await this.em.findOneOrFail(PromptEntity, { id });
    await this.em.removeAndFlush(prompt);
  }
}

@Injectable()
export class PromptTemplateMikroRepository implements IPromptTemplateRepository {
  constructor(private readonly em: EntityManager) {}

  async findAll(): Promise<PromptTemplateEntity[]> {
    return this.em.findAll(PromptTemplateEntity);
  }

  async findById(id: string): Promise<PromptTemplateEntity | null> {
    return this.em.findOne(PromptTemplateEntity, { id });
  }

  async findActive(): Promise<PromptTemplateEntity[]> {
    return this.em.find(
      PromptTemplateEntity,
      { isActive: true },
      { orderBy: { version: QueryOrder.DESC } },
    );
  }

  async create(data: Partial<PromptTemplateEntity>): Promise<PromptTemplateEntity> {
    const template = new PromptTemplateEntity(data);
    await this.em.persistAndFlush(template);
    return template;
  }

  async update(id: string, data: Partial<PromptTemplateEntity>): Promise<PromptTemplateEntity> {
    const template = await this.em.findOneOrFail(PromptTemplateEntity, { id });
    this.em.assign(template, data);
    await this.em.flush();
    return template;
  }
}
