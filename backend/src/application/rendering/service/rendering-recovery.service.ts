import { Injectable, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import type { IRenderingRepository } from '../../../domain/rendering/repository/rendering.repository.interface.js';
import { RENDERING_REPOSITORY } from '../../../domain/rendering/repository/rendering.repository.interface.js';
import { RenderingStatus } from '../../../domain/rendering/model/rendering.entity.js';

@Injectable()
export class RenderingRecoveryService implements OnModuleInit {
  private readonly logger = new Logger(RenderingRecoveryService.name);
  private readonly STUCK_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

  constructor(
    @Inject(RENDERING_REPOSITORY)
    private readonly renderingRepository: IRenderingRepository,
  ) {}

  async onModuleInit() {
    await this.recoverStuckRenderings();
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async recoverStuckRenderings() {
    const stuckRenderings = await this.renderingRepository.findStuck(this.STUCK_THRESHOLD_MS);

    if (stuckRenderings.length === 0) return;

    this.logger.warn(`Found ${stuckRenderings.length} stuck rendering(s). Recovering...`);

    for (const rendering of stuckRenderings) {
      await this.renderingRepository.update(rendering.id, {
        status: RenderingStatus.FAILED,
        errorMessage: `Automatically recovered from stuck ${rendering.status} state (exceeded ${this.STUCK_THRESHOLD_MS / 1000}s)`,
      });
      this.logger.warn(`Recovered stuck rendering ${rendering.id} (was ${rendering.status})`);
    }
  }
}
