import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SketchApplicationService } from './sketch-application.service.js';
import { SKETCH_REPOSITORY } from '../../../domain/sketch/repository/sketch.repository.interface.js';

const mockSketchRepo = {
  findByProjectId: jest.fn<any>(),
  findById: jest.fn<any>(),
  create: jest.fn<any>(),
  delete: jest.fn<any>(),
};

describe('SketchApplicationService', () => {
  let service: SketchApplicationService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SketchApplicationService,
        { provide: SKETCH_REPOSITORY, useValue: mockSketchRepo },
      ],
    }).compile();

    service = module.get<SketchApplicationService>(SketchApplicationService);
  });

  describe('findByProjectId', () => {
    it('should return sketches for a project', async () => {
      const sketches = [{ id: 's1', projectId: 'p1', imageUrl: '/img.png', filename: 'img.png', sortOrder: 0 }];
      mockSketchRepo.findByProjectId.mockResolvedValue(sketches);

      const result = await service.findByProjectId('p1');
      expect(result).toEqual(sketches);
    });
  });

  describe('findById', () => {
    it('should throw NotFoundException when sketch not found', async () => {
      mockSketchRepo.findById.mockResolvedValue(null);
      await expect(service.findById('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create sketch with default sortOrder 0', async () => {
      const dto = { projectId: 'p1', imageUrl: '/img.png', filename: 'sketch.png' };
      const created = { id: 's1', ...dto, sortOrder: 0 };
      mockSketchRepo.create.mockResolvedValue(created);

      const result = await service.create(dto);
      expect(result.sortOrder).toBe(0);
      expect(mockSketchRepo.create).toHaveBeenCalledWith({
        projectId: 'p1',
        imageUrl: '/img.png',
        filename: 'sketch.png',
        sortOrder: 0,
      });
    });
  });

  describe('delete', () => {
    it('should delete sketch after existence check', async () => {
      mockSketchRepo.findById.mockResolvedValue({ id: 's1' });
      mockSketchRepo.delete.mockResolvedValue(undefined);

      await service.delete('s1');
      expect(mockSketchRepo.delete).toHaveBeenCalledWith('s1');
    });
  });
});
