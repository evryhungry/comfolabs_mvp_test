import { defineConfig } from '@mikro-orm/mysql';
import { UserEntity } from '../../domain/user/model/user.entity.js';
import { ProjectEntity } from '../../domain/project/model/project.entity.js';
import { SketchEntity } from '../../domain/sketch/model/sketch.entity.js';
import { MoodboardEntity } from '../../domain/moodboard/model/moodboard.entity.js';
import { PromptEntity, PromptTemplateEntity } from '../../domain/prompt/model/prompt.entity.js';
import { RenderingEntity } from '../../domain/rendering/model/rendering.entity.js';
import 'dotenv/config';

export default defineConfig({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USERNAME || 'admin',
  password: process.env.DB_PASSWORD || '1234',
  dbName: process.env.DB_NAME || 'mvp_dev',
  entities: [
    UserEntity,
    ProjectEntity,
    SketchEntity,
    MoodboardEntity,
    PromptEntity,
    PromptTemplateEntity,
    RenderingEntity,
  ],
  debug: process.env.NODE_ENV !== 'production',
  dynamicImportProvider: (id) => import(id),
});
