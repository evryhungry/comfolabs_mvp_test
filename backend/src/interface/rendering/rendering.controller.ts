import { Controller, Get, Post, Body, Param, Query, HttpCode } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { RenderingApplicationService } from '../../application/rendering/service/rendering-application.service.js';
import { ExecuteRenderingDto } from '../../application/rendering/dto/create-rendering.dto.js';

@Controller('renderings')
export class RenderingController {
  constructor(private readonly renderingService: RenderingApplicationService) {}

  @Get('queue/status')
  getQueueStatus() {
    return this.renderingService.getQueueStatus();
  }

  @Get()
  findByProject(@Query('projectId') projectId: string) {
    return this.renderingService.findByProjectId(projectId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.renderingService.findById(id);
  }

  @Get(':id/status')
  getStatus(@Param('id') id: string) {
    return this.renderingService.getRenderingStatus(id);
  }

  /**
   * POST /renderings/execute
   * Enqueue rendering and return immediately (HTTP 202).
   * Poll GET /renderings/:id/status for progress.
   */
  @Post('execute')
  @HttpCode(202)
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  execute(@Body() dto: ExecuteRenderingDto) {
    return this.renderingService.enqueueRendering(dto);
  }
}
