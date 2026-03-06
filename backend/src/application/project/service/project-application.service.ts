import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { BusinessException } from '../../../infrastructure/filter/business.exception.js';
import { ErrorCode } from '../../../infrastructure/filter/error-codes.js';
import type { IProjectRepository } from '../../../domain/project/repository/project.repository.interface.js';
import { PROJECT_REPOSITORY } from '../../../domain/project/repository/project.repository.interface.js';
import { CreateProjectDto } from '../dto/create-project.dto.js';
import { UpdateProjectDto } from '../dto/update-project.dto.js';
import { ProjectEntity } from '../../../domain/project/model/project.entity.js';

@Injectable()
export class ProjectApplicationService {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async findAll(): Promise<ProjectEntity[]> {
    return this.projectRepository.findAll();
  }

  async findById(id: string): Promise<ProjectEntity> {
    const project = await this.projectRepository.findById(id);
    if (!project) throw new BusinessException(ErrorCode.PROJECT_NOT_FOUND, `Project ${id} not found`, HttpStatus.NOT_FOUND);
    return project;
  }

  async findByUserId(userId: string): Promise<ProjectEntity[]> {
    return this.projectRepository.findByUserId(userId);
  }

  async create(dto: CreateProjectDto): Promise<ProjectEntity> {
    return this.projectRepository.create({
      userId: dto.userId,
      title: dto.title,
      description: dto.description,
    });
  }

  async update(id: string, dto: UpdateProjectDto): Promise<ProjectEntity> {
    await this.findById(id);
    return this.projectRepository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    return this.projectRepository.delete(id);
  }
}
