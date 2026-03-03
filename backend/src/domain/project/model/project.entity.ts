import { randomUUID } from 'crypto';
import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { UserEntity } from '../../user/model/user.entity.js';

@Entity({ tableName: 'Project' })
export class ProjectEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = randomUUID();

  @ManyToOne(() => UserEntity, { mapToPk: true, fieldName: 'userId' })
  userId: string;

  @Property()
  title: string;

  @Property({ nullable: true })
  description: string | null;

  @Property({ fieldName: 'createdAt', onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ fieldName: 'updatedAt', onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(partial: Partial<ProjectEntity>) {
    Object.assign(this, partial);
  }
}
