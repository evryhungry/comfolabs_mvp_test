import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ISketchRepository } from '../../../domain/sketch/repository/sketch.repository.interface.js';
import { SKETCH_REPOSITORY } from '../../../domain/sketch/repository/sketch.repository.interface.js';
import { CreateSketchDto } from '../dto/create-sketch.dto.js';
import { SketchEntity } from '../../../domain/sketch/model/sketch.entity.js';

@Injectable()
export class SketchApplicationService {
  constructor(
    @Inject(SKETCH_REPOSITORY)
    private readonly sketchRepository: ISketchRepository,
  ) {}

  async findByProjectId(projectId: string): Promise<SketchEntity[]> {
    return this.sketchRepository.findByProjectId(projectId);
  }

  async findById(id: string): Promise<SketchEntity> {
    const sketch = await this.sketchRepository.findById(id);
    if (!sketch) throw new NotFoundException(`Sketch ${id} not found`);
    return sketch;
  }

  async create(dto: CreateSketchDto): Promise<SketchEntity> {
    return this.sketchRepository.create({
      projectId: dto.projectId,
      imageUrl: dto.imageUrl,
      filename: dto.filename,
      sortOrder: dto.sortOrder ?? 0,
    });
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    return this.sketchRepository.delete(id);
  }
}
