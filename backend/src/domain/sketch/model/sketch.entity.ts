import { randomUUID } from 'crypto';
import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { ProjectEntity } from '../../project/model/project.entity.js';

@Entity({ tableName: 'Sketch' })
export class SketchEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = randomUUID();

  @ManyToOne(() => ProjectEntity, { mapToPk: true, fieldName: 'projectId' })
  projectId: string;

  @Property({ fieldName: 'imageUrl' })
  imageUrl: string;

  @Property()
  filename: string;

  @Property({ fieldName: 'sortOrder', default: 0 })
  sortOrder: number = 0;

  @Property({ fieldName: 'createdAt', onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ fieldName: 'updatedAt', onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(partial: Partial<SketchEntity>) {
    Object.assign(this, partial);
  }
}
