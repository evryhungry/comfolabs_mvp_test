import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UserApplicationService } from '../../application/user/service/user-application.service.js';
import { CreateUserDto } from '../../application/user/dto/create-user.dto.js';
import { UpdateUserDto } from '../../application/user/dto/update-user.dto.js';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserApplicationService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
