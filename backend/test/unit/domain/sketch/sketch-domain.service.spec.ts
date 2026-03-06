import { SketchDomainService } from '../../../../src/domain/sketch/service/sketch-domain.service';

describe('SketchDomainService', () => {
  let service: SketchDomainService;

  beforeEach(() => {
    service = new SketchDomainService();
  });

  describe('isValidImageFile', () => {
    it.each([
      ['photo.png'],
      ['sketch.jpg'],
      ['render.jpeg'],
      ['design.webp'],
    ])('should return true for allowed extension: %s', (filename) => {
      expect(service.isValidImageFile(filename)).toBe(true);
    });

    it('should be case-insensitive', () => {
      expect(service.isValidImageFile('photo.PNG')).toBe(true);
      expect(service.isValidImageFile('sketch.JPG')).toBe(true);
      expect(service.isValidImageFile('render.JPEG')).toBe(true);
      expect(service.isValidImageFile('design.WebP')).toBe(true);
    });

    it.each([
      ['document.pdf'],
      ['video.mp4'],
      ['archive.zip'],
      ['data.svg'],
      ['image.gif'],
      ['script.ts'],
    ])('should return false for disallowed extension: %s', (filename) => {
      expect(service.isValidImageFile(filename)).toBe(false);
    });

    it('should return false for filename without extension', () => {
      expect(service.isValidImageFile('noextension')).toBe(false);
    });
  });
});
