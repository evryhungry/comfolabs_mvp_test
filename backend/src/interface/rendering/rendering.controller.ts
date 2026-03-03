import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { RenderingApplicationService } from '../../application/rendering/service/rendering-application.service.js';
import { ExecuteRenderingDto } from '../../application/rendering/dto/create-rendering.dto.js';

@Controller('renderings')
export class RenderingController {
  constructor(private readonly renderingService: RenderingApplicationService) {}

  @Get()
  findByProject(@Query('projectId') projectId: string) {
    return this.renderingService.findByProjectId(projectId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.renderingService.findById(id);
  }

  /**
   * POST /renderings/execute
   * Full pipeline: sketch + moodboard + prompt → OpenAI → result
   */
  @Post('execute')
  execute(@Body() dto: ExecuteRenderingDto) {
    return this.renderingService.executeRendering(dto);
  }
}
