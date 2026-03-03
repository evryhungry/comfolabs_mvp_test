import { Injectable } from '@nestjs/common';
import { EntityManager, QueryOrder } from '@mikro-orm/mysql';
import { IProjectRepository } from '../../domain/project/repository/project.repository.interface.js';
import { ProjectEntity } from '../../domain/project/model/project.entity.js';

@Injectable()
export class ProjectMikroRepository implements IProjectRepository {
  constructor(private readonly em: EntityManager) {}

  async findAll(): Promise<ProjectEntity[]> {
    return this.em.findAll(ProjectEntity, { orderBy: { createdAt: QueryOrder.DESC } });
  }

  async findById(id: string): Promise<ProjectEntity | null> {
    return this.em.findOne(ProjectEntity, { id });
  }

  async findByUserId(userId: string): Promise<ProjectEntity[]> {
    return this.em.find(ProjectEntity, { userId }, { orderBy: { createdAt: QueryOrder.DESC } });
  }

  async create(data: Partial<ProjectEntity>): Promise<ProjectEntity> {
    const project = new ProjectEntity(data);
    await this.em.persistAndFlush(project);
    return project;
  }

  async update(id: string, data: Partial<ProjectEntity>): Promise<ProjectEntity> {
    const project = await this.em.findOneOrFail(ProjectEntity, { id });
    this.em.assign(project, data);
    await this.em.flush();
    return project;
  }

  async delete(id: string): Promise<void> {
    const project = await this.em.findOneOrFail(ProjectEntity, { id });
    await this.em.removeAndFlush(project);
  }
}
