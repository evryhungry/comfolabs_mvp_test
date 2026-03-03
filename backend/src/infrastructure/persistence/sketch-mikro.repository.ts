import { Injectable } from '@nestjs/common';
import { EntityManager, QueryOrder } from '@mikro-orm/mysql';
import { ISketchRepository } from '../../domain/sketch/repository/sketch.repository.interface.js';
import { SketchEntity } from '../../domain/sketch/model/sketch.entity.js';

@Injectable()
export class SketchMikroRepository implements ISketchRepository {
  constructor(private readonly em: EntityManager) {}

  async findByProjectId(projectId: string): Promise<SketchEntity[]> {
    return this.em.find(SketchEntity, { projectId }, { orderBy: { sortOrder: QueryOrder.ASC } });
  }

  async findById(id: string): Promise<SketchEntity | null> {
    return this.em.findOne(SketchEntity, { id });
  }

  async create(data: Partial<SketchEntity>): Promise<SketchEntity> {
    const sketch = new SketchEntity(data);
    await this.em.persistAndFlush(sketch);
    return sketch;
  }

  async delete(id: string): Promise<void> {
    const sketch = await this.em.findOneOrFail(SketchEntity, { id });
    await this.em.removeAndFlush(sketch);
  }
}
