import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RenderingApplicationService } from './rendering-application.service.js';
import { RENDERING_REPOSITORY } from '../../../domain/rendering/repository/rendering.repository.interface.js';
import { SKETCH_REPOSITORY } from '../../../domain/sketch/repository/sketch.repository.interface.js';
import { MOODBOARD_REPOSITORY } from '../../../domain/moodboard/repository/moodboard.repository.interface.js';
import { PROMPT_REPOSITORY, PROMPT_TEMPLATE_REPOSITORY } from '../../../domain/prompt/repository/prompt.repository.interface.js';
import { GeminiClient } from '../../../infrastructure/external/gemini.client.js';
import { RenderingStatus } from '../../../domain/rendering/model/rendering.entity.js';

const mockRenderingRepo = {
  findByProjectId: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};

const mockSketchRepo = {
  findByProjectId: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
};

const mockMoodboardRepo = {
  findByProjectId: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

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

const mockGeminiClient = {
  generateImage: jest.fn(),
};

describe('RenderingApplicationService', () => {
  let service: RenderingApplicationService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RenderingApplicationService,
        { provide: RENDERING_REPOSITORY, useValue: mockRenderingRepo },
        { provide: SKETCH_REPOSITORY, useValue: mockSketchRepo },
        { provide: MOODBOARD_REPOSITORY, useValue: mockMoodboardRepo },
        { provide: PROMPT_REPOSITORY, useValue: mockPromptRepo },
        { provide: PROMPT_TEMPLATE_REPOSITORY, useValue: mockTemplateRepo },
        { provide: GeminiClient, useValue: mockGeminiClient },
      ],
    }).compile();

    service = module.get<RenderingApplicationService>(RenderingApplicationService);
  });

  describe('findByProjectId', () => {
    it('should return renderings for a project', async () => {
      const renderings = [{ id: 'r1', projectId: 'p1', status: RenderingStatus.COMPLETED }];
      mockRenderingRepo.findByProjectId.mockResolvedValue(renderings);

      const result = await service.findByProjectId('p1');
      expect(result).toEqual(renderings);
    });
  });

  describe('findById', () => {
    it('should throw NotFoundException when rendering not found', async () => {
      mockRenderingRepo.findById.mockResolvedValue(null);

      await expect(service.findById('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('executeRendering', () => {
    const dto = {
      projectId: 'p1',
      userPrompt: 'Matte black finish with brushed aluminum.',
    };

    it('should throw BadRequestException when no sketches exist', async () => {
      mockSketchRepo.findByProjectId.mockResolvedValue([]);

      await expect(service.executeRendering(dto)).rejects.toThrow(BadRequestException);
      await expect(service.executeRendering(dto)).rejects.toThrow('no sketches');
    });

    it('should throw BadRequestException when no moodboard exists', async () => {
      mockSketchRepo.findByProjectId.mockResolvedValue([
        { id: 's1', imageUrl: 'https://example.com/sketch.png' },
      ]);
      mockMoodboardRepo.findByProjectId.mockResolvedValue(null);

      await expect(service.executeRendering(dto)).rejects.toThrow(BadRequestException);
      await expect(service.executeRendering(dto)).rejects.toThrow('no moodboard');
    });

    it('should execute full pipeline and return response', async () => {
      // Setup: sketch, moodboard, template, prompt, rendering
      mockSketchRepo.findByProjectId.mockResolvedValue([
        { id: 's1', imageUrl: 'https://example.com/sketch.png', filename: 'sketch.png' },
      ]);
      mockMoodboardRepo.findByProjectId.mockResolvedValue({
        id: 'm1',
        imageUrls: ['https://example.com/mood.png'],
        combinedUrl: 'https://example.com/combined.png',
      });
      mockTemplateRepo.findActive.mockResolvedValue([]);
      mockPromptRepo.create.mockResolvedValue({
        id: 'pr1',
        projectId: 'p1',
        userInput: dto.userPrompt,
        finalPrompt: 'composed prompt',
      });
      mockRenderingRepo.create.mockResolvedValue({
        id: 'r1',
        projectId: 'p1',
        promptId: 'pr1',
        status: RenderingStatus.PENDING,
      });
      mockRenderingRepo.update.mockResolvedValue({
        id: 'r1',
        status: RenderingStatus.COMPLETED,
      });
      mockGeminiClient.generateImage.mockResolvedValue({
        resultUrl: 'https://example.com/result.png',
        textResponse: 'Rendered successfully',
        metadata: {
          model: 'gemini-2.5-flash',
          promptTokens: 1520,
          completionTokens: 800,
          totalTokens: 2320,
          createdAt: '2025-02-27T10:30:00Z',
        },
      });

      const result = await service.executeRendering(dto);

      // Verify response shape
      expect(result.projectId).toBe('p1');
      expect(result.renderedImage).toBe('https://example.com/result.png');
      expect(result.views).toEqual(['https://example.com/result.png']);
      expect(result.promptUsed).toBeDefined();
      expect(result.metadata.model).toBe('gemini-2.5-flash');
      expect(result.metadata.totalTokens).toBe(2320);

      // Verify pipeline steps
      expect(mockSketchRepo.findByProjectId).toHaveBeenCalledWith('p1');
      expect(mockMoodboardRepo.findByProjectId).toHaveBeenCalledWith('p1');
      expect(mockPromptRepo.create).toHaveBeenCalledTimes(1);
      expect(mockRenderingRepo.create).toHaveBeenCalledTimes(1);
      expect(mockGeminiClient.generateImage).toHaveBeenCalledTimes(1);

      // Verify status transitions: PENDING → PROCESSING → COMPLETED
      expect(mockRenderingRepo.update).toHaveBeenCalledWith('r1', {
        status: RenderingStatus.PROCESSING,
      });
      expect(mockRenderingRepo.update).toHaveBeenCalledWith('r1', {
        status: RenderingStatus.COMPLETED,
        resultUrl: 'https://example.com/result.png',
      });
    });

    it('should use specific prompt template when templateId is provided', async () => {
      mockSketchRepo.findByProjectId.mockResolvedValue([
        { id: 's1', imageUrl: 'https://example.com/sketch.png' },
      ]);
      mockMoodboardRepo.findByProjectId.mockResolvedValue({
        id: 'm1',
        imageUrls: ['https://example.com/mood.png'],
        combinedUrl: null,
      });
      mockTemplateRepo.findById.mockResolvedValue({
        id: 't1',
        content: 'Custom template: {{USER_INPUT}}',
      });
      mockPromptRepo.create.mockResolvedValue({ id: 'pr1' });
      mockRenderingRepo.create.mockResolvedValue({ id: 'r1', status: RenderingStatus.PENDING });
      mockRenderingRepo.update.mockResolvedValue({ id: 'r1', status: RenderingStatus.COMPLETED });
      mockGeminiClient.generateImage.mockResolvedValue({
        resultUrl: null,
        textResponse: 'No image',
        metadata: { model: 'gemini-2.5-flash', promptTokens: 0, completionTokens: 0, totalTokens: 0, createdAt: '' },
      });

      const result = await service.executeRendering({
        ...dto,
        promptTemplateId: 't1',
      });

      expect(mockTemplateRepo.findById).toHaveBeenCalledWith('t1');
      expect(result.views).toEqual([]);
    });

    it('should mark rendering as FAILED when OpenAI call fails', async () => {
      mockSketchRepo.findByProjectId.mockResolvedValue([
        { id: 's1', imageUrl: 'https://example.com/sketch.png' },
      ]);
      mockMoodboardRepo.findByProjectId.mockResolvedValue({
        id: 'm1',
        imageUrls: ['https://example.com/mood.png'],
        combinedUrl: 'https://example.com/combined.png',
      });
      mockTemplateRepo.findActive.mockResolvedValue([]);
      mockPromptRepo.create.mockResolvedValue({ id: 'pr1' });
      mockRenderingRepo.create.mockResolvedValue({ id: 'r1', status: RenderingStatus.PENDING });
      mockRenderingRepo.update.mockResolvedValue({ id: 'r1' });
      mockGeminiClient.generateImage.mockRejectedValue(new Error('API quota exceeded'));

      await expect(service.executeRendering(dto)).rejects.toThrow('API quota exceeded');

      // Verify FAILED status was set
      expect(mockRenderingRepo.update).toHaveBeenCalledWith('r1', {
        status: RenderingStatus.FAILED,
        errorMessage: 'API quota exceeded',
      });
    });
  });
});
