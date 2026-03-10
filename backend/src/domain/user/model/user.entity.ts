import { randomUUID } from 'crypto';
import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity({ tableName: 'User' })
export class UserEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = randomUUID();

  @Property()
  @Unique()
  email: string;

  @Property()
  name: string;

  @Property({ nullable: true })
  provider?: string;

  @Property({ nullable: true })
  googleId?: string;

  @Property({ nullable: true })
  profileImage?: string;

  @Property({ fieldName: 'createdAt', onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ fieldName: 'updatedAt', onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
