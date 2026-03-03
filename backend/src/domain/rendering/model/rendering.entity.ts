import { randomUUID } from 'crypto';
import { Entity, PrimaryKey, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { ProjectEntity } from '../../project/model/project.entity.js';
import { PromptEntity } from '../../prompt/model/prompt.entity.js';

export enum RenderingStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum ViewType {
  COMBINED = 'COMBINED',
  FRONT = 'FRONT',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  BACK = 'BACK',
  PERSPECTIVE = 'PERSPECTIVE',
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
}

@Entity({ tableName: 'Rendering' })
export class RenderingEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = randomUUID();

  @ManyToOne(() => ProjectEntity, { mapToPk: true, fieldName: 'projectId' })
  projectId: string;

  @ManyToOne(() => PromptEntity, { mapToPk: true, fieldName: 'promptId' })
  promptId: string;

  @Property({ fieldName: 'resultUrl', nullable: true })
  resultUrl: string | null;

  @Enum({ items: () => RenderingStatus, default: RenderingStatus.PENDING })
  status: RenderingStatus = RenderingStatus.PENDING;

  @Enum({ fieldName: 'viewType', items: () => ViewType, default: ViewType.COMBINED })
  viewType: ViewType = ViewType.COMBINED;

  @Property({ fieldName: 'errorMessage', nullable: true })
  errorMessage: string | null;

  @Property({ fieldName: 'createdAt', onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ fieldName: 'updatedAt', onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(partial: Partial<RenderingEntity>) {
    Object.assign(this, partial);
  }
}
