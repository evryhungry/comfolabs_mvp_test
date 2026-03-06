import { Injectable, Inject, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import type { IRenderingRepository } from '../../../domain/rendering/repository/rendering.repository.interface.js';
import { RENDERING_REPOSITORY } from '../../../domain/rendering/repository/rendering.repository.interface.js';
import type { ISketchRepository } from '../../../domain/sketch/repository/sketch.repository.interface.js';
import { SKETCH_REPOSITORY } from '../../../domain/sketch/repository/sketch.repository.interface.js';
import type { IMoodboardRepository } from '../../../domain/moodboard/repository/moodboard.repository.interface.js';
import { MOODBOARD_REPOSITORY } from '../../../domain/moodboard/repository/moodboard.repository.interface.js';
import type { IPromptRepository, IPromptTemplateRepository } from '../../../domain/prompt/repository/prompt.repository.interface.js';
import { PROMPT_REPOSITORY, PROMPT_TEMPLATE_REPOSITORY } from '../../../domain/prompt/repository/prompt.repository.interface.js';
import { RenderingEntity, RenderingStatus } from '../../../domain/rendering/model/rendering.entity.js';
import type { SketchEntity } from '../../../domain/sketch/model/sketch.entity.js';
import type { MoodboardEntity } from '../../../domain/moodboard/model/moodboard.entity.js';
import { PromptDomainService, BASE_SYSTEM_PROMPT_V1 } from '../../../domain/prompt/service/prompt-domain.service.js';
import { GeminiClient } from '../../../infrastructure/external/gemini.client.js';
import type { EnqueueRenderingResponseDto, RenderingStatusDto, RenderingResponseDto } from '../dto/create-rendering.dto.js';
import { ExecuteRenderingDto } from '../dto/create-rendering.dto.js';
import { promises as fsPromises } from 'fs';
import * as path from 'path';

@Injectable()
export class RenderingApplicationService {
  private readonly logger = new Logger(RenderingApplicationService.name);
  private readonly promptDomainService = new PromptDomainService();

  constructor(
    @Inject(RENDERING_REPOSITORY)
    private readonly renderingRepository: IRenderingRepository,
    @Inject(SKETCH_REPOSITORY)
    private readonly sketchRepository: ISketchRepository,
    @Inject(MOODBOARD_REPOSITORY)
    private readonly moodboardRepository: IMoodboardRepository,
    @Inject(PROMPT_REPOSITORY)
    private readonly promptRepository: IPromptRepository,
    @Inject(PROMPT_TEMPLATE_REPOSITORY)
    private readonly templateRepository: IPromptTemplateRepository,
    private readonly geminiClient: GeminiClient,
  ) {}

  async findByProjectId(projectId: string): Promise<RenderingEntity[]> {
    return this.renderingRepository.findByProjectId(projectId);
  }

  async findById(id: string): Promise<RenderingEntity> {
    const rendering = await this.renderingRepository.findById(id);
    if (!rendering) throw new NotFoundException(`Rendering ${id} not found`);
    return rendering;
  }

  /**
   * Enqueue rendering: validate inputs, create DB records, start background processing.
   * Returns immediately with renderingId (HTTP 202).
   */
  async enqueueRendering(dto: ExecuteRenderingDto): Promise<EnqueueRenderingResponseDto> {
    const { projectId, userPrompt, sketchId, moodboardImageIndex, promptTemplateId } = dto;

    // Duplicate execution guard
    const existingRenderings = await this.renderingRepository.findByProjectId(projectId);
    const inProgress = existingRenderings.find(
      r => r.status === RenderingStatus.PENDING || r.status === RenderingStatus.PROCESSING,
    );
    if (inProgress) {
      throw new BadRequestException(
        `Rendering ${inProgress.id} is already in progress for this project.`,
      );
    }

    // Validate inputs
    const selectedSketch = await this.resolveSketch(projectId, sketchId);
    const moodboard = await this.resolveMoodboard(projectId);
    const systemPrompt = await this.resolveSystemPrompt(promptTemplateId);

    // Create prompt record
    const finalPrompt = this.promptDomainService.buildFinalPrompt(systemPrompt, userPrompt || '');
    const promptRecord = await this.promptRepository.create({
      projectId,
      templateId: promptTemplateId || null,
      userInput: userPrompt || '',
      finalPrompt,
    });

    // Create rendering record (PENDING)
    const rendering = await this.renderingRepository.create({
      projectId,
      promptId: promptRecord.id,
      status: RenderingStatus.PENDING,
    });

    // Queue info
    const queueStatus = this.geminiClient.getQueueStatus();
    const queuePosition = queueStatus.waiting + 1;

    // Fire-and-forget background processing
    this.processRenderingAsync(rendering.id, {
      selectedSketch,
      moodboard,
      moodboardImageIndex,
      systemPrompt,
      userPrompt: userPrompt || '',
    }).catch(err => {
      this.logger.error(`Background rendering ${rendering.id} failed: ${err.message}`);
    });

    return {
      renderingId: rendering.id,
      status: RenderingStatus.PENDING,
      message: 'Rendering queued. Poll GET /renderings/{id}/status for progress.',
      queue: {
        position: queuePosition,
        estimatedWaitSeconds: Math.ceil((queuePosition * 45000) / this.geminiClient.getQueueStatus().maxConcurrent / 1000),
        totalInQueue: queueStatus.waiting + 1,
      },
    };
  }

  /**
   * Get rendering status for polling.
   */
  async getRenderingStatus(id: string): Promise<RenderingStatusDto> {
    const rendering = await this.findById(id);
    return {
      id: rendering.id,
      status: rendering.status,
      resultUrl: rendering.resultUrl,
      errorMessage: rendering.errorMessage,
      createdAt: rendering.createdAt,
      updatedAt: rendering.updatedAt,
    };
  }

  /**
   * Get current queue status.
   */
  getQueueStatus() {
    const status = this.geminiClient.getQueueStatus();
    return {
      ...status,
      estimatedWaitForNewRequest: Math.ceil(
        ((status.waiting + 1) * 45000) / status.maxConcurrent / 1000,
      ),
    };
  }

  /**
   * Background rendering pipeline (fire-and-forget).
   */
  private async processRenderingAsync(
    renderingId: string,
    context: {
      selectedSketch: SketchEntity;
      moodboard: MoodboardEntity;
      moodboardImageIndex?: number;
      systemPrompt: string;
      userPrompt: string;
    },
  ): Promise<void> {
    const { selectedSketch, moodboard, moodboardImageIndex, systemPrompt, userPrompt } = context;

    try {
      // Convert images to base64 (async I/O)
      const sketchBase64 = await this.imageToBase64(selectedSketch.imageUrl);
      const moodboardUrl = this.resolveMoodboardUrl(moodboard, moodboardImageIndex);
      const moodboardBase64 = await this.imageToBase64(moodboardUrl);

      // Update status to PROCESSING
      await this.renderingRepository.update(renderingId, {
        status: RenderingStatus.PROCESSING,
      });

      // Call Gemini (2-step pipeline, concurrency-controlled by Semaphore)
      const result = await this.geminiClient.generateImage(
        this.promptDomainService.buildSystemPromptOnly(systemPrompt),
        userPrompt,
        sketchBase64,
        moodboardBase64,
      );

      // Save generated image (async I/O)
      let resultUrl: string | null = null;
      if (result.imageBase64) {
        resultUrl = await this.saveBase64Image(result.imageBase64, renderingId);
      }

      // Update status to COMPLETED
      await this.renderingRepository.update(renderingId, {
        status: RenderingStatus.COMPLETED,
        resultUrl,
      });

      this.logger.log(`Rendering ${renderingId} completed successfully`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Rendering ${renderingId} failed: ${errorMessage}`);

      await this.renderingRepository.update(renderingId, {
        status: RenderingStatus.FAILED,
        errorMessage,
      });

      throw error;
    }
  }

  // ── Helper methods ──

  private async resolveSketch(projectId: string, sketchId?: string): Promise<SketchEntity> {
    if (sketchId) {
      const sketch = await this.sketchRepository.findById(sketchId);
      if (!sketch) throw new BadRequestException(`Sketch ${sketchId} not found`);
      return sketch;
    }
    const sketches = await this.sketchRepository.findByProjectId(projectId);
    if (sketches.length === 0) {
      throw new BadRequestException('Project has no sketches. Upload at least one sketch.');
    }
    return sketches[0];
  }

  private async resolveMoodboard(projectId: string): Promise<MoodboardEntity> {
    const moodboard = await this.moodboardRepository.findByProjectId(projectId);
    if (!moodboard) {
      throw new BadRequestException('Project has no moodboard. Upload a moodboard first.');
    }
    return moodboard;
  }

  private async resolveSystemPrompt(promptTemplateId?: string): Promise<string> {
    if (promptTemplateId) {
      const template = await this.templateRepository.findById(promptTemplateId);
      if (template) return template.content;
    } else {
      const activeTemplates = await this.templateRepository.findActive();
      if (activeTemplates.length > 0) return activeTemplates[0].content;
    }
    return BASE_SYSTEM_PROMPT_V1;
  }

  private resolveMoodboardUrl(moodboard: MoodboardEntity, index?: number): string {
    if (index !== undefined && index < moodboard.imageUrls.length) {
      return moodboard.imageUrls[index];
    }
    if (moodboard.combinedUrl) return moodboard.combinedUrl;
    return moodboard.imageUrls[0];
  }

  private async saveBase64Image(
    base64Data: string,
    renderingId: string,
  ): Promise<string> {
    const renderingsDir = path.join(process.cwd(), 'uploads', 'renderings');
    await fsPromises.mkdir(renderingsDir, { recursive: true });

    const filename = `${renderingId}.png`;
    const filePath = path.join(renderingsDir, filename);

    const buffer = Buffer.from(base64Data, 'base64');
    await fsPromises.writeFile(filePath, buffer);

    this.logger.log(`Saved rendered image: ${filePath}`);
    return `/uploads/renderings/${filename}`;
  }

  private async imageToBase64(imageUrl: string): Promise<string> {
    if (imageUrl.startsWith('data:')) {
      return imageUrl;
    }

    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }

    const absolutePath = imageUrl.startsWith('/uploads/')
      ? path.join(process.cwd(), imageUrl)
      : path.isAbsolute(imageUrl)
        ? imageUrl
        : path.resolve(process.cwd(), imageUrl);

    const fileBuffer = await fsPromises.readFile(absolutePath);
    const ext = path.extname(absolutePath).toLowerCase().slice(1);
    const mimeType = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
    return `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
  }
}
