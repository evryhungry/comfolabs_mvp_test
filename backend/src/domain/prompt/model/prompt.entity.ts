import { randomUUID } from 'crypto';
import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { ProjectEntity } from '../../project/model/project.entity.js';

@Entity({ tableName: 'Prompt' })
export class PromptEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = randomUUID();

  @ManyToOne(() => ProjectEntity, { mapToPk: true, fieldName: 'projectId' })
  projectId: string;

  @ManyToOne(() => PromptTemplateEntity, { mapToPk: true, fieldName: 'templateId', nullable: true })
  templateId: string | null;

  @Property({ fieldName: 'userInput', type: 'text' })
  userInput: string;

  @Property({ fieldName: 'finalPrompt', type: 'text' })
  finalPrompt: string;

  @Property({ fieldName: 'createdAt', onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ fieldName: 'updatedAt', onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(partial: Partial<PromptEntity>) {
    Object.assign(this, partial);
  }
}

@Entity({ tableName: 'PromptTemplate' })
export class PromptTemplateEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = randomUUID();

  @Property()
  name: string;

  @Property({ type: 'text' })
  content: string;

  @Property({ default: 1 })
  version: number = 1;

  @Property({ fieldName: 'isActive', default: true })
  isActive: boolean = true;

  @Property({ fieldName: 'createdAt', onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ fieldName: 'updatedAt', onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(partial: Partial<PromptTemplateEntity>) {
    Object.assign(this, partial);
  }
}
