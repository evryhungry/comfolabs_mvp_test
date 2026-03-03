import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SketchController } from './sketch.controller.js';
import { SketchApplicationService } from '../../application/sketch/service/sketch-application.service.js';
import { SketchMikroRepository } from '../../infrastructure/persistence/sketch-mikro.repository.js';
import { SKETCH_REPOSITORY } from '../../domain/sketch/repository/sketch.repository.interface.js';
import { SketchEntity } from '../../domain/sketch/model/sketch.entity.js';

@Module({
  imports: [MikroOrmModule.forFeature([SketchEntity])],
  controllers: [SketchController],
  providers: [
    SketchApplicationService,
    { provide: SKETCH_REPOSITORY, useClass: SketchMikroRepository },
  ],
  exports: [SketchApplicationService],
})
export class SketchModule {}
