import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EntityManager } from '@mikro-orm/mysql';
import { RenderingEntity, RenderingStatus } from '../../../domain/rendering/model/rendering.entity.js';

@Injectable()
export class RenderingRecoveryService implements OnModuleInit {
  private readonly logger = new Logger(RenderingRecoveryService.name);
  private readonly STUCK_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

  constructor(private readonly em: EntityManager) {}

  async onModuleInit() {
    await this.recoverStuckRenderings();
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async recoverStuckRenderings() {
    const fork = this.em.fork();
    const cutoff = new Date(Date.now() - this.STUCK_THRESHOLD_MS);

    const stuckRenderings = await fork.find(RenderingEntity, {
      status: { $in: [RenderingStatus.PENDING, RenderingStatus.PROCESSING] },
      updatedAt: { $lt: cutoff },
    });

    if (stuckRenderings.length === 0) return;

    this.logger.warn(`Found ${stuckRenderings.length} stuck rendering(s). Recovering...`);

    for (const rendering of stuckRenderings) {
      fork.assign(rendering, {
        status: RenderingStatus.FAILED,
        errorMessage: `Automatically recovered from stuck ${rendering.status} state (exceeded ${this.STUCK_THRESHOLD_MS / 1000}s)`,
      });
      this.logger.warn(`Recovered stuck rendering ${rendering.id} (was ${rendering.status})`);
    }

    await fork.flush();
  }
}
