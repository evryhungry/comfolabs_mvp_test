import { RenderingEntity } from '../model/rendering.entity.js';

export interface IRenderingRepository {
  findByProjectId(projectId: string): Promise<RenderingEntity[]>;
  findById(id: string): Promise<RenderingEntity | null>;
  create(rendering: Partial<RenderingEntity>): Promise<RenderingEntity>;
  update(id: string, rendering: Partial<RenderingEntity>): Promise<RenderingEntity>;
}

export const RENDERING_REPOSITORY = Symbol('RENDERING_REPOSITORY');
