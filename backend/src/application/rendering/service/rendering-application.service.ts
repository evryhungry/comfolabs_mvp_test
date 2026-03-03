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
import { PromptDomainService, BASE_SYSTEM_PROMPT_V1 } from '../../../domain/prompt/service/prompt-domain.service.js';
import { GeminiClient } from '../../../infrastructure/external/gemini.client.js';
import type { RenderingResponseDto } from '../dto/create-rendering.dto.js';
import { ExecuteRenderingDto } from '../dto/create-rendering.dto.js';
import * as fs from 'fs';
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
   * Full rendering pipeline:
   * 1. Load project sketches + moodboard
   * 2. Resolve prompt template (or use default v1.0)
   * 3. Build final prompt
   * 4. Convert images to base64
   * 5. Call Gemini API
   * 6. Save results
   */
  async executeRendering(dto: ExecuteRenderingDto): Promise<RenderingResponseDto> {
    const { projectId, userPrompt, sketchId, moodboardImageIndex, promptTemplateId } = dto;

    // 1. Load sketch (specific or first available)
    let selectedSketch;
    if (sketchId) {
      selectedSketch = await this.sketchRepository.findById(sketchId);
      if (!selectedSketch) {
        throw new BadRequestException(`Sketch ${sketchId} not found`);
      }
    } else {
      const sketches = await this.sketchRepository.findByProjectId(projectId);
      if (sketches.length === 0) {
        throw new BadRequestException('Project has no sketches. Upload at least one sketch.');
      }
      selectedSketch = sketches[0];
    }

    // 2. Load moodboard
    const moodboard = await this.moodboardRepository.findByProjectId(projectId);
    if (!moodboard) {
      throw new BadRequestException('Project has no moodboard. Upload a moodboard first.');
    }

    // 3. Resolve prompt template
    let systemPrompt = BASE_SYSTEM_PROMPT_V1;
    if (promptTemplateId) {
      const template = await this.templateRepository.findById(promptTemplateId);
      if (template) {
        systemPrompt = template.content;
      }
    } else {
      const activeTemplates = await this.templateRepository.findActive();
      if (activeTemplates.length > 0) {
        systemPrompt = activeTemplates[0].content;
      }
    }

    // 4. Build final prompt
    const finalPrompt = this.promptDomainService.buildFinalPrompt(systemPrompt, userPrompt);

    // 5. Save prompt record
    const promptRecord = await this.promptRepository.create({
      projectId,
      templateId: promptTemplateId || null,
      userInput: userPrompt,
      finalPrompt,
    });

    // 6. Create rendering record (PENDING)
    const rendering = await this.renderingRepository.create({
      projectId,
      promptId: promptRecord.id,
      status: RenderingStatus.PENDING,
    });

    // 7. Convert images to base64
    const sketchBase64 = await this.imageToBase64(selectedSketch.imageUrl);

    let moodboardUrl: string;
    if (moodboardImageIndex !== undefined && moodboardImageIndex < moodboard.imageUrls.length) {
      moodboardUrl = moodboard.imageUrls[moodboardImageIndex];
    } else if (moodboard.combinedUrl) {
      moodboardUrl = moodboard.combinedUrl;
    } else {
      moodboardUrl = moodboard.imageUrls[0];
    }
    const moodboardBase64 = await this.imageToBase64(moodboardUrl);

    // 8. Update status to PROCESSING
    await this.renderingRepository.update(rendering.id, {
      status: RenderingStatus.PROCESSING,
    });

    // 9. Call Gemini (2-step pipeline: Vision → Image Generation)
    try {
      const result = await this.geminiClient.generateImage(
        this.promptDomainService.buildSystemPromptOnly(systemPrompt),
        userPrompt,
        sketchBase64,
        moodboardBase64,
      );

      // 10. Save generated image to file
      let resultUrl: string | null = null;
      if (result.imageBase64) {
        resultUrl = await this.saveBase64Image(
          result.imageBase64,
          rendering.id,
        );
      }

      // 11. Update rendering with result
      await this.renderingRepository.update(rendering.id, {
        status: RenderingStatus.COMPLETED,
        resultUrl,
      });

      return {
        projectId,
        renderedImage: resultUrl,
        views: resultUrl ? [resultUrl] : [],
        promptUsed: finalPrompt,
        metadata: result.metadata,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Rendering failed for project ${projectId}: ${errorMessage}`);

      await this.renderingRepository.update(rendering.id, {
        status: RenderingStatus.FAILED,
        errorMessage,
      });

      throw error;
    }
  }

  private async saveBase64Image(
    base64Data: string,
    renderingId: string,
  ): Promise<string> {
    const renderingsDir = path.join(process.cwd(), 'uploads', 'renderings');
    if (!fs.existsSync(renderingsDir)) {
      fs.mkdirSync(renderingsDir, { recursive: true });
    }

    const filename = `${renderingId}.png`;
    const filePath = path.join(renderingsDir, filename);

    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filePath, buffer);

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

    // /uploads/... paths are relative to cwd, not filesystem root
    const absolutePath = imageUrl.startsWith('/uploads/')
      ? path.join(process.cwd(), imageUrl)
      : path.isAbsolute(imageUrl)
        ? imageUrl
        : path.resolve(process.cwd(), imageUrl);

    const fileBuffer = fs.readFileSync(absolutePath);
    const ext = path.extname(absolutePath).toLowerCase().slice(1);
    const mimeType = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
    return `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
  }
}
