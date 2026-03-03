import { SketchEntity } from '../model/sketch.entity.js';

export interface ISketchRepository {
  findByProjectId(projectId: string): Promise<SketchEntity[]>;
  findById(id: string): Promise<SketchEntity | null>;
  create(sketch: Partial<SketchEntity>): Promise<SketchEntity>;
  delete(id: string): Promise<void>;
}

export const SKETCH_REPOSITORY = Symbol('SKETCH_REPOSITORY');
