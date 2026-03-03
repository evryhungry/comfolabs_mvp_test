import { randomUUID } from 'crypto';
import { Entity, PrimaryKey, Property, OneToOne } from '@mikro-orm/core';
import { ProjectEntity } from '../../project/model/project.entity.js';

@Entity({ tableName: 'Moodboard' })
export class MoodboardEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = randomUUID();

  @OneToOne(() => ProjectEntity, { mapToPk: true, fieldName: 'projectId', owner: true, unique: true })
  projectId: string;

  @Property({ fieldName: 'imageUrls', type: 'json', default: '[]' })
  imageUrls: string[] = [];

  @Property({ fieldName: 'combinedUrl', nullable: true })
  combinedUrl: string | null;

  @Property({ nullable: true })
  characteristics: string | null;

  @Property({ fieldName: 'createdAt', onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ fieldName: 'updatedAt', onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(partial: Partial<MoodboardEntity>) {
    Object.assign(this, partial);
  }
}
