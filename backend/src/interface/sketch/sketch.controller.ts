import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { mkdirSync } from 'fs';
import { randomUUID } from 'crypto';
import { SketchApplicationService } from '../../application/sketch/service/sketch-application.service.js';
import { CreateSketchDto } from '../../application/sketch/dto/create-sketch.dto.js';

const UPLOAD_DIR = join(process.cwd(), 'uploads', 'sketches');
mkdirSync(UPLOAD_DIR, { recursive: true });

@Controller('sketches')
export class SketchController {
  constructor(private readonly sketchService: SketchApplicationService) {}

  @Get()
  findByProject(@Query('projectId') projectId: string) {
    return this.sketchService.findByProjectId(projectId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.sketchService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateSketchDto) {
    return this.sketchService.create(dto);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
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
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('projectId') projectId: string,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    if (!projectId) {
      throw new BadRequestException('projectId is required');
    }

    const imageUrl = `/uploads/sketches/${file.filename}`;
    return this.sketchService.create({
      projectId,
      imageUrl,
      filename: file.originalname,
    });
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.sketchService.delete(id);
  }
}
