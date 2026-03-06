import { MoodboardDomainService } from '../../../../src/domain/moodboard/service/moodboard-domain.service.js';

describe('MoodboardDomainService', () => {
  let service: MoodboardDomainService;

  beforeEach(() => {
    service = new MoodboardDomainService();
  });

  describe('isReadyForRendering', () => {
    it('should return true when imageUrls has items and combinedUrl is set', () => {
      expect(service.isReadyForRendering(['/img/1.png'], '/combined.png')).toBe(true);
    });

    it('should return true with multiple imageUrls and combinedUrl', () => {
      expect(service.isReadyForRendering(['/a.png', '/b.png'], '/combined.png')).toBe(true);
    });

    it('should return false when imageUrls is empty', () => {
      expect(service.isReadyForRendering([], '/combined.png')).toBe(false);
    });

    it('should return false when combinedUrl is undefined', () => {
      expect(service.isReadyForRendering(['/img/1.png'])).toBe(false);
    });

    it('should return false when combinedUrl is empty string', () => {
      expect(service.isReadyForRendering(['/img/1.png'], '')).toBe(false);
    });

    it('should return false when both are empty', () => {
      expect(service.isReadyForRendering([])).toBe(false);
    });
  });
});
