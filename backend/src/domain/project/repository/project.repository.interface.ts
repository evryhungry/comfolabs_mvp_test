import { ProjectEntity } from '../model/project.entity.js';

export interface IProjectRepository {
  findAll(): Promise<ProjectEntity[]>;
  findById(id: string): Promise<ProjectEntity | null>;
  findByUserId(userId: string): Promise<ProjectEntity[]>;
  create(project: Partial<ProjectEntity>): Promise<ProjectEntity>;
  update(id: string, project: Partial<ProjectEntity>): Promise<ProjectEntity>;
  delete(id: string): Promise<void>;
}

export const PROJECT_REPOSITORY = Symbol('PROJECT_REPOSITORY');
