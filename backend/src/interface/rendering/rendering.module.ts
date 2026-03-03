import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { RenderingController } from './rendering.controller.js';
import { RenderingApplicationService } from '../../application/rendering/service/rendering-application.service.js';
import { RenderingMikroRepository } from '../../infrastructure/persistence/rendering-mikro.repository.js';
import { RENDERING_REPOSITORY } from '../../domain/rendering/repository/rendering.repository.interface.js';
import { SketchMikroRepository } from '../../infrastructure/persistence/sketch-mikro.repository.js';
import { SKETCH_REPOSITORY } from '../../domain/sketch/repository/sketch.repository.interface.js';
import { MoodboardMikroRepository } from '../../infrastructure/persistence/moodboard-mikro.repository.js';
import { MOODBOARD_REPOSITORY } from '../../domain/moodboard/repository/moodboard.repository.interface.js';
import { PromptMikroRepository, PromptTemplateMikroRepository } from '../../infrastructure/persistence/prompt-mikro.repository.js';
import { PROMPT_REPOSITORY, PROMPT_TEMPLATE_REPOSITORY } from '../../domain/prompt/repository/prompt.repository.interface.js';
import { OpenAIClient } from '../../infrastructure/external/openai.client.js';
import { RenderingEntity } from '../../domain/rendering/model/rendering.entity.js';
import { SketchEntity } from '../../domain/sketch/model/sketch.entity.js';
import { MoodboardEntity } from '../../domain/moodboard/model/moodboard.entity.js';
import { PromptEntity, PromptTemplateEntity } from '../../domain/prompt/model/prompt.entity.js';

@Module({
  imports: [MikroOrmModule.forFeature([RenderingEntity, SketchEntity, MoodboardEntity, PromptEntity, PromptTemplateEntity])],
  controllers: [RenderingController],
  providers: [
    RenderingApplicationService,
    OpenAIClient,
    { provide: RENDERING_REPOSITORY, useClass: RenderingMikroRepository },
    { provide: SKETCH_REPOSITORY, useClass: SketchMikroRepository },
    { provide: MOODBOARD_REPOSITORY, useClass: MoodboardMikroRepository },
    { provide: PROMPT_REPOSITORY, useClass: PromptMikroRepository },
    { provide: PROMPT_TEMPLATE_REPOSITORY, useClass: PromptTemplateMikroRepository },
  ],
  exports: [RenderingApplicationService],
})
export class RenderingModule {}
