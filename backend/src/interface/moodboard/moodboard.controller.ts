import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { mkdirSync } from 'fs';
import { randomUUID } from 'crypto';
import { MoodboardApplicationService } from '../../application/moodboard/service/moodboard-application.service.js';
import { CreateMoodboardDto } from '../../application/moodboard/dto/create-moodboard.dto.js';
import { UpdateMoodboardDto } from '../../application/moodboard/dto/update-moodboard.dto.js';

const UPLOAD_DIR = join(process.cwd(), 'uploads', 'moodboard');
mkdirSync(UPLOAD_DIR, { recursive: true });

@Controller('moodboards')
export class MoodboardController {
  constructor(private readonly moodboardService: MoodboardApplicationService) {}

  @Get()
  findByProject(@Query('projectId') projectId: string) {
    return this.moodboardService.findByProjectId(projectId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.moodboardService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateMoodboardDto) {
    return this.moodboardService.create(dto);
  }

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
        filename: (_req, file, cb) => {
          const uniqueName = `${randomUUID()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          cb(new BadRequestException('Only image files are allowed'), false);
          return;
        }
        cb(null, true);
      },
      limits: { fileSize: 20 * 1024 * 1024 },
    }),
  )
  async upload(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('projectId') projectId: string,
    @Body('characteristics') characteristics?: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one file is required');
    }
    if (!projectId) {
      throw new BadRequestException('projectId is required');
    }

    const imageUrls = files.map((f) => `/uploads/moodboard/${f.filename}`);

    // Check if moodboard already exists for this project
    const existing = await this.moodboardService.findByProjectId(projectId);
    if (existing) {
      // Append new images to existing moodboard
      const updatedUrls = [...existing.imageUrls, ...imageUrls];
      return this.moodboardService.update(existing.id, {
        imageUrls: updatedUrls,
        ...(characteristics ? { characteristics } : {}),
      });
    }

    return this.moodboardService.create({
      projectId,
      imageUrls,
      ...(characteristics ? { characteristics } : {}),
    });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMoodboardDto) {
    return this.moodboardService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.moodboardService.delete(id);
  }
}
