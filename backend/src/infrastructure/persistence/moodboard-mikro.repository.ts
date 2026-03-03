import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/mysql';
import { IMoodboardRepository } from '../../domain/moodboard/repository/moodboard.repository.interface.js';
import { MoodboardEntity } from '../../domain/moodboard/model/moodboard.entity.js';

@Injectable()
export class MoodboardMikroRepository implements IMoodboardRepository {
  constructor(private readonly em: EntityManager) {}

  async findByProjectId(projectId: string): Promise<MoodboardEntity | null> {
    return this.em.findOne(MoodboardEntity, { projectId });
  }

  async findById(id: string): Promise<MoodboardEntity | null> {
    return this.em.findOne(MoodboardEntity, { id });
  }

  async create(data: Partial<MoodboardEntity>): Promise<MoodboardEntity> {
    const moodboard = new MoodboardEntity(data);
    await this.em.persistAndFlush(moodboard);
    return moodboard;
  }

  async update(id: string, data: Partial<MoodboardEntity>): Promise<MoodboardEntity> {
    const moodboard = await this.em.findOneOrFail(MoodboardEntity, { id });
    this.em.assign(moodboard, data);
    await this.em.flush();
    return moodboard;
  }

  async delete(id: string): Promise<void> {
    const moodboard = await this.em.findOneOrFail(MoodboardEntity, { id });
    await this.em.removeAndFlush(moodboard);
  }
}
