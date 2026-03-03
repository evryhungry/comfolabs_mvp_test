// Mock Prisma generated client before any imports
jest.mock('../generated/prisma/client.js', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({})),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/persistence/prisma.service';
import { GeminiClient } from '../src/infrastructure/external/gemini.client';

const mockPrismaService = {
  onModuleInit: jest.fn(),
  onModuleDestroy: jest.fn(),
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  project: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  sketch: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
  moodboard: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  prompt: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
  promptTemplate: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  rendering: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

const mockGeminiClient = {
  generateImage: jest.fn(),
};

describe('API Endpoints (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .overrideProvider(GeminiClient)
      .useValue(mockGeminiClient)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===================== USER =====================

  describe('/users', () => {
    const mockUser = {
      id: 'u1',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    describe('GET /users', () => {
      it('should return all users', async () => {
        mockPrismaService.user.findMany.mockResolvedValue([mockUser]);

        const res = await request(app.getHttpServer()).get('/users').expect(200);

        expect(res.body).toHaveLength(1);
        expect(res.body[0].email).toBe('test@example.com');
      });
    });

    describe('GET /users/:id', () => {
      it('should return a user by id', async () => {
        mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

        const res = await request(app.getHttpServer()).get('/users/u1').expect(200);
        expect(res.body.name).toBe('Test User');
      });

      it('should return 404 for non-existent user', async () => {
        mockPrismaService.user.findUnique.mockResolvedValue(null);
        await request(app.getHttpServer()).get('/users/nonexistent').expect(404);
      });
    });

    describe('POST /users', () => {
      it('should create a user with valid data', async () => {
        mockPrismaService.user.create.mockResolvedValue(mockUser);

        const res = await request(app.getHttpServer())
          .post('/users')
          .send({ email: 'test@example.com', name: 'Test User' })
          .expect(201);

        expect(res.body.email).toBe('test@example.com');
      });

      it('should return 400 for invalid email', async () => {
        await request(app.getHttpServer())
          .post('/users')
          .send({ email: 'invalid-email', name: 'Test' })
          .expect(400);
      });

      it('should return 400 for missing name', async () => {
        await request(app.getHttpServer())
          .post('/users')
          .send({ email: 'test@example.com' })
          .expect(400);
      });
    });

    describe('DELETE /users/:id', () => {
      it('should delete a user', async () => {
        mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
        mockPrismaService.user.delete.mockResolvedValue(mockUser);

        await request(app.getHttpServer()).delete('/users/u1').expect(200);
      });
    });
  });

  // ===================== PROJECT =====================

  describe('/projects', () => {
    const mockProject = {
      id: 'p1',
      userId: 'u1',
      title: 'Test Project',
      description: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    describe('GET /projects', () => {
      it('should return all projects', async () => {
        mockPrismaService.project.findMany.mockResolvedValue([mockProject]);

        const res = await request(app.getHttpServer()).get('/projects').expect(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].title).toBe('Test Project');
      });

      it('should filter by userId', async () => {
        mockPrismaService.project.findMany.mockResolvedValue([mockProject]);

        const res = await request(app.getHttpServer())
          .get('/projects?userId=u1')
          .expect(200);
        expect(res.body).toHaveLength(1);
      });
    });

    describe('POST /projects', () => {
      it('should create a project', async () => {
        mockPrismaService.project.create.mockResolvedValue(mockProject);

        const res = await request(app.getHttpServer())
          .post('/projects')
          .send({ userId: 'u1', title: 'Test Project' })
          .expect(201);

        expect(res.body.title).toBe('Test Project');
      });

      it('should return 400 for missing title', async () => {
        await request(app.getHttpServer())
          .post('/projects')
          .send({ userId: 'u1' })
          .expect(400);
      });
    });

    describe('PUT /projects/:id', () => {
      it('should update a project', async () => {
        mockPrismaService.project.findUnique.mockResolvedValue(mockProject);
        mockPrismaService.project.update.mockResolvedValue({ ...mockProject, title: 'Updated' });

        const res = await request(app.getHttpServer())
          .put('/projects/p1')
          .send({ title: 'Updated' })
          .expect(200);

        expect(res.body.title).toBe('Updated');
      });
    });
  });

  // ===================== SKETCH =====================

  describe('/sketches', () => {
    const mockSketch = {
      id: 's1',
      projectId: 'p1',
      imageUrl: '/uploads/sketch.png',
      filename: 'sketch.png',
      sortOrder: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    describe('GET /sketches?projectId=', () => {
      it('should return sketches for a project', async () => {
        mockPrismaService.sketch.findMany.mockResolvedValue([mockSketch]);

        const res = await request(app.getHttpServer())
          .get('/sketches?projectId=p1')
          .expect(200);

        expect(res.body).toHaveLength(1);
        expect(res.body[0].filename).toBe('sketch.png');
      });
    });

    describe('POST /sketches', () => {
      it('should create a sketch', async () => {
        mockPrismaService.sketch.create.mockResolvedValue(mockSketch);

        const res = await request(app.getHttpServer())
          .post('/sketches')
          .send({ projectId: 'p1', imageUrl: '/uploads/sketch.png', filename: 'sketch.png' })
          .expect(201);

        expect(res.body.filename).toBe('sketch.png');
      });

      it('should return 400 for missing projectId', async () => {
        await request(app.getHttpServer())
          .post('/sketches')
          .send({ imageUrl: '/img.png', filename: 'img.png' })
          .expect(400);
      });
    });
  });

  // ===================== MOODBOARD =====================

  describe('/moodboards', () => {
    const mockMoodboard = {
      id: 'm1',
      projectId: 'p1',
      imageUrls: ['url1', 'url2'],
      combinedUrl: null,
      characteristics: 'Modern minimalist',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    describe('GET /moodboards?projectId=', () => {
      it('should return moodboard for a project', async () => {
        mockPrismaService.moodboard.findUnique.mockResolvedValue(mockMoodboard);

        const res = await request(app.getHttpServer())
          .get('/moodboards?projectId=p1')
          .expect(200);

        expect(res.body.characteristics).toBe('Modern minimalist');
      });
    });

    describe('POST /moodboards', () => {
      it('should create a moodboard', async () => {
        mockPrismaService.moodboard.create.mockResolvedValue(mockMoodboard);

        const res = await request(app.getHttpServer())
          .post('/moodboards')
          .send({ projectId: 'p1', imageUrls: ['url1', 'url2'] })
          .expect(201);

        expect(res.body.imageUrls).toEqual(['url1', 'url2']);
      });

      it('should return 400 for missing imageUrls', async () => {
        await request(app.getHttpServer())
          .post('/moodboards')
          .send({ projectId: 'p1' })
          .expect(400);
      });
    });
  });

  // ===================== PROMPT =====================

  describe('/prompts', () => {
    const mockPrompt = {
      id: 'pr1',
      projectId: 'p1',
      templateId: null,
      userInput: 'Matte black finish',
      finalPrompt: 'Composed prompt...',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    describe('GET /prompts?projectId=', () => {
      it('should return prompts for a project', async () => {
        mockPrismaService.prompt.findMany.mockResolvedValue([mockPrompt]);

        const res = await request(app.getHttpServer())
          .get('/prompts?projectId=p1')
          .expect(200);

        expect(res.body).toHaveLength(1);
      });
    });

    describe('GET /prompts/templates', () => {
      it('should return active templates', async () => {
        mockPrismaService.promptTemplate.findMany.mockResolvedValue([
          { id: 't1', name: 'v1.0', content: 'System prompt', version: 1, isActive: true },
        ]);

        const res = await request(app.getHttpServer())
          .get('/prompts/templates')
          .expect(200);

        expect(res.body).toHaveLength(1);
        expect(res.body[0].name).toBe('v1.0');
      });
    });

    describe('POST /prompts', () => {
      it('should create a prompt', async () => {
        mockPrismaService.prompt.create.mockResolvedValue(mockPrompt);

        const res = await request(app.getHttpServer())
          .post('/prompts')
          .send({ projectId: 'p1', userInput: 'Matte black finish' })
          .expect(201);

        expect(res.body.userInput).toBe('Matte black finish');
      });
    });

    describe('POST /prompts/templates', () => {
      it('should create a prompt template', async () => {
        mockPrismaService.promptTemplate.create.mockResolvedValue({
          id: 't2',
          name: 'v2.0',
          content: 'New template',
          version: 1,
          isActive: true,
        });

        const res = await request(app.getHttpServer())
          .post('/prompts/templates')
          .send({ name: 'v2.0', content: 'New template' })
          .expect(201);

        expect(res.body.name).toBe('v2.0');
      });
    });
  });

  // ===================== RENDERING =====================

  describe('/renderings', () => {
    const mockRendering = {
      id: 'r1',
      projectId: 'p1',
      promptId: 'pr1',
      resultUrl: null,
      status: 'PENDING',
      viewType: 'COMBINED',
      errorMessage: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    describe('GET /renderings?projectId=', () => {
      it('should return renderings for a project', async () => {
        mockPrismaService.rendering.findMany.mockResolvedValue([mockRendering]);

        const res = await request(app.getHttpServer())
          .get('/renderings?projectId=p1')
          .expect(200);

        expect(res.body).toHaveLength(1);
        expect(res.body[0].status).toBe('PENDING');
      });
    });

    describe('POST /renderings/execute', () => {
      it('should execute full rendering pipeline and return response', async () => {
        mockPrismaService.sketch.findMany.mockResolvedValue([
          { id: 's1', projectId: 'p1', imageUrl: 'https://example.com/sketch.png', filename: 'sketch.png', sortOrder: 0 },
        ]);
        mockPrismaService.moodboard.findUnique.mockResolvedValue({
          id: 'm1',
          projectId: 'p1',
          imageUrls: ['https://example.com/mood.png'],
          combinedUrl: 'https://example.com/combined.png',
          characteristics: null,
        });
        mockPrismaService.promptTemplate.findMany.mockResolvedValue([]);
        mockPrismaService.prompt.create.mockResolvedValue({
          id: 'pr1',
          projectId: 'p1',
          templateId: null,
          userInput: 'Matte black finish',
          finalPrompt: 'Full prompt',
        });
        mockPrismaService.rendering.create.mockResolvedValue(mockRendering);
        mockPrismaService.rendering.update.mockResolvedValue({
          ...mockRendering,
          status: 'COMPLETED',
          resultUrl: 'https://example.com/result.png',
        });
        mockGeminiClient.generateImage.mockResolvedValue({
          resultUrl: 'https://example.com/result.png',
          textResponse: 'Generated',
          metadata: {
            model: 'gpt-4o',
            promptTokens: 1520,
            completionTokens: 800,
            totalTokens: 2320,
            createdAt: '2025-02-27T10:30:00Z',
          },
        });

        const res = await request(app.getHttpServer())
          .post('/renderings/execute')
          .send({ projectId: 'p1', userPrompt: 'Matte black finish' })
          .expect(201);

        expect(res.body.projectId).toBe('p1');
        expect(res.body.renderedImage).toBe('https://example.com/result.png');
        expect(res.body.views).toEqual(['https://example.com/result.png']);
        expect(res.body.metadata.model).toBe('gpt-4o');
        expect(res.body.metadata.totalTokens).toBe(2320);
        expect(res.body.promptUsed).toBeDefined();
      });

      it('should return 400 when project has no sketches', async () => {
        mockPrismaService.sketch.findMany.mockResolvedValue([]);

        await request(app.getHttpServer())
          .post('/renderings/execute')
          .send({ projectId: 'p1', userPrompt: 'Test' })
          .expect(400);
      });

      it('should return 400 when project has no moodboard', async () => {
        mockPrismaService.sketch.findMany.mockResolvedValue([
          { id: 's1', imageUrl: 'https://example.com/sketch.png' },
        ]);
        mockPrismaService.moodboard.findUnique.mockResolvedValue(null);

        await request(app.getHttpServer())
          .post('/renderings/execute')
          .send({ projectId: 'p1', userPrompt: 'Test' })
          .expect(400);
      });

      it('should return 400 for missing userPrompt', async () => {
        await request(app.getHttpServer())
          .post('/renderings/execute')
          .send({ projectId: 'p1' })
          .expect(400);
      });
    });
  });
});
