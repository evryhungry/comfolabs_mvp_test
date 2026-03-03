import { MoodboardEntity } from '../model/moodboard.entity.js';

export interface IMoodboardRepository {
  findByProjectId(projectId: string): Promise<MoodboardEntity | null>;
  findById(id: string): Promise<MoodboardEntity | null>;
  create(moodboard: Partial<MoodboardEntity>): Promise<MoodboardEntity>;
  update(id: string, moodboard: Partial<MoodboardEntity>): Promise<MoodboardEntity>;
  delete(id: string): Promise<void>;
}

export const MOODBOARD_REPOSITORY = Symbol('MOODBOARD_REPOSITORY');
