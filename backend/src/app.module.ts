import { Module, type NestModule, type MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from './infrastructure/config/mikro-orm.config.js';
import { UserModule } from './interface/user/user.module.js';
import { ProjectModule } from './interface/project/project.module.js';
import { SketchModule } from './interface/sketch/sketch.module.js';
import { MoodboardModule } from './interface/moodboard/moodboard.module.js';
import { PromptModule } from './interface/prompt/prompt.module.js';
import { RenderingModule } from './interface/rendering/rendering.module.js';
import { OAuthModule } from './interface/oauth/oauth.module.js';
import { HealthModule } from './interface/health/health.module.js';
import { LoggingMiddleware } from './infrastructure/middleware/logging.middleware.js';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 60,
    }]),
    ScheduleModule.forRoot(),
    HealthModule,
    UserModule,
    ProjectModule,
    SketchModule,
    MoodboardModule,
    PromptModule,
    RenderingModule,
    OAuthModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
