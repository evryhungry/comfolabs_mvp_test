import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MoodboardController } from './moodboard.controller.js';
import { MoodboardApplicationService } from '../../application/moodboard/service/moodboard-application.service.js';
import { MoodboardMikroRepository } from '../../infrastructure/persistence/moodboard-mikro.repository.js';
import { MOODBOARD_REPOSITORY } from '../../domain/moodboard/repository/moodboard.repository.interface.js';
import { MoodboardEntity } from '../../domain/moodboard/model/moodboard.entity.js';

@Module({
  imports: [MikroOrmModule.forFeature([MoodboardEntity])],
  controllers: [MoodboardController],
  providers: [
    MoodboardApplicationService,
    { provide: MOODBOARD_REPOSITORY, useClass: MoodboardMikroRepository },
  ],
  exports: [MoodboardApplicationService],
})
export class MoodboardModule {}
