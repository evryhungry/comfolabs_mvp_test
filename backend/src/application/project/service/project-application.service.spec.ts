import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProjectApplicationService } from './project-application.service.js';
import { PROJECT_REPOSITORY } from '../../../domain/project/repository/project.repository.interface.js';

const mockProjectRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByUserId: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('ProjectApplicationService', () => {
  let service: ProjectApplicationService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectApplicationService,
        { provide: PROJECT_REPOSITORY, useValue: mockProjectRepository },
      ],
    }).compile();

    service = module.get<ProjectApplicationService>(ProjectApplicationService);
  });

  describe('findAll', () => {
    it('should return all projects', async () => {
      const projects = [
        { id: '1', userId: 'u1', title: 'Project A', description: null, createdAt: new Date(), updatedAt: new Date() },
      ];
      mockProjectRepository.findAll.mockResolvedValue(projects);

      const result = await service.findAll();
      expect(result).toEqual(projects);
    });
  });

  describe('findByUserId', () => {
    it('should return projects for a specific user', async () => {
      const projects = [
        { id: '1', userId: 'u1', title: 'Project A', description: null, createdAt: new Date(), updatedAt: new Date() },
      ];
      mockProjectRepository.findByUserId.mockResolvedValue(projects);

      const result = await service.findByUserId('u1');
      expect(result).toEqual(projects);
      expect(mockProjectRepository.findByUserId).toHaveBeenCalledWith('u1');
    });
  });

  describe('findById', () => {
    it('should throw NotFoundException when project not found', async () => {
      mockProjectRepository.findById.mockResolvedValue(null);

      await expect(service.findById('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a project with userId, title, and optional description', async () => {
      const dto = { userId: 'u1', title: 'New Project', description: 'A description' };
      const created = { id: '2', ...dto, createdAt: new Date(), updatedAt: new Date() };
      mockProjectRepository.create.mockResolvedValue(created);

      const result = await service.create(dto);

      expect(result).toEqual(created);
      expect(mockProjectRepository.create).toHaveBeenCalledWith({
        userId: 'u1',
        title: 'New Project',
        description: 'A description',
      });
    });
  });

  describe('delete', () => {
    it('should delete project after existence check', async () => {
      mockProjectRepository.findById.mockResolvedValue({ id: '1' });
      mockProjectRepository.delete.mockResolvedValue(undefined);

      await service.delete('1');

      expect(mockProjectRepository.delete).toHaveBeenCalledWith('1');
    });
  });
});
