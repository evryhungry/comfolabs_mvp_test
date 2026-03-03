import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PromptController } from './prompt.controller.js';
import { PromptApplicationService } from '../../application/prompt/service/prompt-application.service.js';
import {
  PromptMikroRepository,
  PromptTemplateMikroRepository,
} from '../../infrastructure/persistence/prompt-mikro.repository.js';
import { PROMPT_REPOSITORY, PROMPT_TEMPLATE_REPOSITORY } from '../../domain/prompt/repository/prompt.repository.interface.js';
import { PromptEntity, PromptTemplateEntity } from '../../domain/prompt/model/prompt.entity.js';

@Module({
  imports: [MikroOrmModule.forFeature([PromptEntity, PromptTemplateEntity])],
  controllers: [PromptController],
  providers: [
    PromptApplicationService,
    { provide: PROMPT_REPOSITORY, useClass: PromptMikroRepository },
    { provide: PROMPT_TEMPLATE_REPOSITORY, useClass: PromptTemplateMikroRepository },
  ],
  exports: [PromptApplicationService],
})
export class PromptModule {}
