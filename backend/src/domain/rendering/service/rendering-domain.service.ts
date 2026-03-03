import { RenderingEntity, RenderingStatus } from '../model/rendering.entity.js';

export class RenderingDomainService {
  canRetry(rendering: RenderingEntity): boolean {
    return rendering.status === RenderingStatus.FAILED;
  }

  isCompleted(rendering: RenderingEntity): boolean {
    return rendering.status === RenderingStatus.COMPLETED;
  }
}
