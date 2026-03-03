import { Injectable } from '@nestjs/common';
import { EntityManager, QueryOrder } from '@mikro-orm/mysql';
import { IRenderingRepository } from '../../domain/rendering/repository/rendering.repository.interface.js';
import { RenderingEntity } from '../../domain/rendering/model/rendering.entity.js';

@Injectable()
export class RenderingMikroRepository implements IRenderingRepository {
  constructor(private readonly em: EntityManager) {}

  async findByProjectId(projectId: string): Promise<RenderingEntity[]> {
    return this.em.find(RenderingEntity, { projectId }, { orderBy: { createdAt: QueryOrder.DESC } });
  }

  async findById(id: string): Promise<RenderingEntity | null> {
    return this.em.findOne(RenderingEntity, { id });
  }

  async create(data: Partial<RenderingEntity>): Promise<RenderingEntity> {
    const rendering = new RenderingEntity(data);
    await this.em.persistAndFlush(rendering);
    return rendering;
  }

  async update(id: string, data: Partial<RenderingEntity>): Promise<RenderingEntity> {
    const rendering = await this.em.findOneOrFail(RenderingEntity, { id });
    this.em.assign(rendering, data);
    await this.em.flush();
    return rendering;
  }
}
