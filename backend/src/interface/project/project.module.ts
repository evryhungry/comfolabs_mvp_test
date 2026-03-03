import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ProjectController } from './project.controller.js';
import { ProjectApplicationService } from '../../application/project/service/project-application.service.js';
import { ProjectMikroRepository } from '../../infrastructure/persistence/project-mikro.repository.js';
import { PROJECT_REPOSITORY } from '../../domain/project/repository/project.repository.interface.js';
import { ProjectEntity } from '../../domain/project/model/project.entity.js';

@Module({
  imports: [MikroOrmModule.forFeature([ProjectEntity])],
  controllers: [ProjectController],
  providers: [
    ProjectApplicationService,
    { provide: PROJECT_REPOSITORY, useClass: ProjectMikroRepository },
  ],
  exports: [ProjectApplicationService],
})
export class ProjectModule {}
