import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { PromptApplicationService } from '../../application/prompt/service/prompt-application.service.js';
import { CreatePromptDto } from '../../application/prompt/dto/create-prompt.dto.js';
import { CreatePromptTemplateDto } from '../../application/prompt/dto/create-prompt-template.dto.js';

@Controller('prompts')
export class PromptController {
  constructor(private readonly promptService: PromptApplicationService) {}

  @Get()
  findByProject(@Query('projectId') projectId: string) {
    return this.promptService.findByProjectId(projectId);
  }

  @Get('templates')
  getTemplates() {
    return this.promptService.getTemplates();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.promptService.findById(id);
  }

  @Post()
  create(@Body() dto: CreatePromptDto) {
    return this.promptService.create(dto);
  }

  @Post('templates')
  createTemplate(@Body() dto: CreatePromptTemplateDto) {
    return this.promptService.createTemplate(dto);
  }
}
