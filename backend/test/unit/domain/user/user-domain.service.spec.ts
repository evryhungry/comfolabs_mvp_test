import { UserDomainService } from '../../../../src/domain/user/service/user-domain.service.js';

describe('UserDomainService', () => {
  let service: UserDomainService;

  beforeEach(() => {
    service = new UserDomainService();
  });

  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(service.isValidEmail('user@example.com')).toBe(true);
      expect(service.isValidEmail('test.name@domain.co.kr')).toBe(true);
      expect(service.isValidEmail('a@b.c')).toBe(true);
    });

    it('should return false for emails without @', () => {
      expect(service.isValidEmail('userexample.com')).toBe(false);
    });

    it('should return false for emails without domain', () => {
      expect(service.isValidEmail('user@')).toBe(false);
    });

    it('should return false for emails without local part', () => {
      expect(service.isValidEmail('@example.com')).toBe(false);
    });

    it('should return false for emails with spaces', () => {
      expect(service.isValidEmail('user @example.com')).toBe(false);
      expect(service.isValidEmail('user@ example.com')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(service.isValidEmail('')).toBe(false);
    });
  });
});
