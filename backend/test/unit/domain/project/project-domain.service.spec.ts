import { ProjectDomainService } from '../../../../src/domain/project/service/project-domain.service.js';
import { ProjectEntity } from '../../../../src/domain/project/model/project.entity.js';

describe('ProjectDomainService', () => {
  let service: ProjectDomainService;

  beforeEach(() => {
    service = new ProjectDomainService();
  });

  function makeProject(overrides: { hasSketch: boolean; hasMoodboard: boolean }) {
    const project = new ProjectEntity({ userId: 'u1', title: 'Test' });
    return Object.assign(project, overrides);
  }

  describe('isComplete', () => {
    it('should return true when project has both sketch and moodboard', () => {
      expect(service.isComplete(makeProject({ hasSketch: true, hasMoodboard: true }))).toBe(true);
    });

    it('should return false when project has no sketch', () => {
      expect(service.isComplete(makeProject({ hasSketch: false, hasMoodboard: true }))).toBe(false);
    });

    it('should return false when project has no moodboard', () => {
      expect(service.isComplete(makeProject({ hasSketch: true, hasMoodboard: false }))).toBe(false);
    });

    it('should return false when project has neither sketch nor moodboard', () => {
      expect(service.isComplete(makeProject({ hasSketch: false, hasMoodboard: false }))).toBe(false);
    });
  });
});
