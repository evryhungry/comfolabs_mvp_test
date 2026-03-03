import { ProjectEntity } from '../model/project.entity.js';

export class ProjectDomainService {
  isComplete(project: ProjectEntity & { hasSketch: boolean; hasMoodboard: boolean }): boolean {
    return project.hasSketch && project.hasMoodboard;
  }
}
