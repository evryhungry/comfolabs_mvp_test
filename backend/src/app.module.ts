import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from './infrastructure/config/mikro-orm.config.js';
import { UserModule } from './interface/user/user.module.js';
import { ProjectModule } from './interface/project/project.module.js';
import { SketchModule } from './interface/sketch/sketch.module.js';
import { MoodboardModule } from './interface/moodboard/moodboard.module.js';
import { PromptModule } from './interface/prompt/prompt.module.js';
import { RenderingModule } from './interface/rendering/rendering.module.js';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    UserModule,
    ProjectModule,
    SketchModule,
    MoodboardModule,
    PromptModule,
    RenderingModule,
  ],
})
export class AppModule {}
