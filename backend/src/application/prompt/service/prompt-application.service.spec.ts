import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PromptApplicationService } from './prompt-application.service.js';
import { PROMPT_REPOSITORY, PROMPT_TEMPLATE_REPOSITORY } from '../../../domain/prompt/repository/prompt.repository.interface.js';

const mockPromptRepo = {
  findByProjectId: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
};

const mockTemplateRepo = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findActive: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};

describe('PromptApplicationService', () => {
  let service: PromptApplicationService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromptApplicationService,
        { provide: PROMPT_REPOSITORY, useValue: mockPromptRepo },
        { provide: PROMPT_TEMPLATE_REPOSITORY, useValue: mockTemplateRepo },
      ],
    }).compile();

    service = module.get<PromptApplicationService>(PromptApplicationService);
  });

  describe('findByProjectId', () => {
    it('should return prompts for project', async () => {
      const prompts = [{ id: 'pr1', projectId: 'p1', userInput: 'test', finalPrompt: 'composed' }];
      mockPromptRepo.findByProjectId.mockResolvedValue(prompts);

      const result = await service.findByProjectId('p1');
      expect(result).toEqual(prompts);
    });
  });

  describe('findById', () => {
    it('should throw NotFoundException when not found', async () => {
      mockPromptRepo.findById.mockResolvedValue(null);
      await expect(service.findById('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create prompt using user input as finalPrompt when no template', async () => {
      const dto = { projectId: 'p1', userInput: 'Matte black finish' };
      mockPromptRepo.create.mockImplementation((data) => Promise.resolve({ id: 'pr1', ...data }));

      const result = await service.create(dto);

      expect(result.finalPrompt).toBe('Matte black finish');
      expect(result.userInput).toBe('Matte black finish');
    });

    it('should build finalPrompt from template when templateId provided', async () => {
      const dto = { projectId: 'p1', userInput: 'Matte black', templateId: 't1' };
      mockTemplateRepo.findById.mockResolvedValue({
        id: 't1',
        content: 'Custom system prompt here.',
      });
      mockPromptRepo.create.mockImplementation((data) => Promise.resolve({ id: 'pr1', ...data }));

      const result = await service.create(dto);

      // buildFinalPrompt composes: system + moodboard context + sketch context + user input
      expect(result.finalPrompt).toContain('Custom system prompt here.');
      expect(result.finalPrompt).toContain('Refer to the attached moodboard');
      expect(result.finalPrompt).toContain('Use the attached sketch(es)');
      expect(result.finalPrompt).toContain('Matte black');
    });
  });

  describe('getTemplates', () => {
    it('should return active templates', async () => {
      const templates = [{ id: 't1', name: 'v1.0', isActive: true }];
      mockTemplateRepo.findActive.mockResolvedValue(templates);

      const result = await service.getTemplates();
      expect(result).toEqual(templates);
    });
  });

  describe('createTemplate', () => {
    it('should create a new prompt template', async () => {
      const dto = { name: 'v2.0', content: 'New template {{USER_INPUT}}' };
      mockTemplateRepo.create.mockResolvedValue({ id: 't2', ...dto, version: 1, isActive: true });

      const result = await service.createTemplate(dto);
      expect(result.name).toBe('v2.0');
    });
  });
});
