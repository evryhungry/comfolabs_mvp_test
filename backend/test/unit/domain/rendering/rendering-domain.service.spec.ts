import { RenderingDomainService } from '../../../../src/domain/rendering/service/rendering-domain.service';
import { RenderingEntity, RenderingStatus } from '../../../../src/domain/rendering/model/rendering.entity';

describe('RenderingDomainService', () => {
  let service: RenderingDomainService;

  beforeEach(() => {
    service = new RenderingDomainService();
  });

  function makeRendering(status: RenderingStatus): RenderingEntity {
    return new RenderingEntity({
      projectId: 'p1',
      promptId: 'pr1',
      status,
      resultUrl: null,
      errorMessage: null,
    });
  }

  describe('canRetry', () => {
    it('should return true for FAILED status', () => {
      expect(service.canRetry(makeRendering(RenderingStatus.FAILED))).toBe(true);
    });

    it.each([
      RenderingStatus.PENDING,
      RenderingStatus.PROCESSING,
      RenderingStatus.COMPLETED,
    ])('should return false for %s status', (status) => {
      expect(service.canRetry(makeRendering(status))).toBe(false);
    });
  });

  describe('isCompleted', () => {
    it('should return true for COMPLETED status', () => {
      expect(service.isCompleted(makeRendering(RenderingStatus.COMPLETED))).toBe(true);
    });

    it.each([
      RenderingStatus.PENDING,
      RenderingStatus.PROCESSING,
      RenderingStatus.FAILED,
    ])('should return false for %s status', (status) => {
      expect(service.isCompleted(makeRendering(status))).toBe(false);
    });
  });
});
