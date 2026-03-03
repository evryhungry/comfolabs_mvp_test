import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IMoodboardRepository } from '../../../domain/moodboard/repository/moodboard.repository.interface.js';
import { MOODBOARD_REPOSITORY } from '../../../domain/moodboard/repository/moodboard.repository.interface.js';
import { CreateMoodboardDto } from '../dto/create-moodboard.dto.js';
import { UpdateMoodboardDto } from '../dto/update-moodboard.dto.js';
import { MoodboardEntity } from '../../../domain/moodboard/model/moodboard.entity.js';

@Injectable()
export class MoodboardApplicationService {
  constructor(
    @Inject(MOODBOARD_REPOSITORY)
    private readonly moodboardRepository: IMoodboardRepository,
  ) {}

  async findByProjectId(projectId: string): Promise<MoodboardEntity | null> {
    return this.moodboardRepository.findByProjectId(projectId);
  }

  async findById(id: string): Promise<MoodboardEntity> {
    const moodboard = await this.moodboardRepository.findById(id);
    if (!moodboard) throw new NotFoundException(`Moodboard ${id} not found`);
    return moodboard;
  }

  async create(dto: CreateMoodboardDto): Promise<MoodboardEntity> {
    return this.moodboardRepository.create({
      projectId: dto.projectId,
      imageUrls: dto.imageUrls,
      characteristics: dto.characteristics,
    });
  }

  async update(id: string, dto: UpdateMoodboardDto): Promise<MoodboardEntity> {
    await this.findById(id);
    return this.moodboardRepository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    return this.moodboardRepository.delete(id);
  }
}
