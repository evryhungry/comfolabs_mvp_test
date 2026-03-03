import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ProjectApplicationService } from '../../application/project/service/project-application.service.js';
import { CreateProjectDto } from '../../application/project/dto/create-project.dto.js';
import { UpdateProjectDto } from '../../application/project/dto/update-project.dto.js';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectApplicationService) {}

  @Get()
  findAll(@Query('userId') userId?: string) {
    if (userId) return this.projectService.findByUserId(userId);
    return this.projectService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.projectService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.projectService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.projectService.delete(id);
  }
}
