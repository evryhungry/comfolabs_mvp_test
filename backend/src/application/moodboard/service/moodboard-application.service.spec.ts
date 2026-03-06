import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MoodboardApplicationService } from './moodboard-application.service.js';
import { MOODBOARD_REPOSITORY } from '../../../domain/moodboard/repository/moodboard.repository.interface.js';

const mockMoodboardRepo = {
  findByProjectId: jest.fn<any>(),
  findById: jest.fn<any>(),
  create: jest.fn<any>(),
  update: jest.fn<any>(),
  delete: jest.fn<any>(),
};

describe('MoodboardApplicationService', () => {
  let service: MoodboardApplicationService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoodboardApplicationService,
        { provide: MOODBOARD_REPOSITORY, useValue: mockMoodboardRepo },
      ],
    }).compile();

    service = module.get<MoodboardApplicationService>(MoodboardApplicationService);
  });

  describe('findByProjectId', () => {
    it('should return moodboard or null', async () => {
      mockMoodboardRepo.findByProjectId.mockResolvedValue(null);
      const result = await service.findByProjectId('p1');
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should throw NotFoundException when not found', async () => {
      mockMoodboardRepo.findById.mockResolvedValue(null);
      await expect(service.findById('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create moodboard with imageUrls', async () => {
      const dto = { projectId: 'p1', imageUrls: ['url1', 'url2'], characteristics: 'modern' };
      const created = { id: 'm1', ...dto, combinedUrl: null };
      mockMoodboardRepo.create.mockResolvedValue(created);

      const result = await service.create(dto);
      expect(result.imageUrls).toEqual(['url1', 'url2']);
    });
  });

  describe('update', () => {
    it('should update moodboard after existence check', async () => {
      mockMoodboardRepo.findById.mockResolvedValue({ id: 'm1' });
      mockMoodboardRepo.update.mockResolvedValue({ id: 'm1', combinedUrl: 'new-url' });

      const result = await service.update('m1', { combinedUrl: 'new-url' });
      expect(result.combinedUrl).toBe('new-url');
    });
  });
});
