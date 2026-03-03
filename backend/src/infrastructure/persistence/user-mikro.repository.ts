import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/mysql';
import { IUserRepository } from '../../domain/user/repository/user.repository.interface.js';
import { UserEntity } from '../../domain/user/model/user.entity.js';

@Injectable()
export class UserMikroRepository implements IUserRepository {
  constructor(private readonly em: EntityManager) {}

  async findAll(): Promise<UserEntity[]> {
    return this.em.findAll(UserEntity);
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.em.findOne(UserEntity, { id });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.em.findOne(UserEntity, { email });
  }

  async create(data: Partial<UserEntity>): Promise<UserEntity> {
    const user = new UserEntity(data);
    await this.em.persistAndFlush(user);
    return user;
  }

  async update(id: string, data: Partial<UserEntity>): Promise<UserEntity> {
    const user = await this.em.findOneOrFail(UserEntity, { id });
    this.em.assign(user, data);
    await this.em.flush();
    return user;
  }

  async delete(id: string): Promise<void> {
    const user = await this.em.findOneOrFail(UserEntity, { id });
    await this.em.removeAndFlush(user);
  }
}
