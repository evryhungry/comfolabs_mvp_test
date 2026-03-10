import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { BusinessException } from '../../../infrastructure/filter/business.exception.js';
import { ErrorCode } from '../../../infrastructure/filter/error-codes.js';
import type { IUserRepository } from '../../../domain/user/repository/user.repository.interface.js';
import { USER_REPOSITORY } from '../../../domain/user/repository/user.repository.interface.js';
import { CreateUserDto } from '../dto/create-user.dto.js';
import { UpdateUserDto } from '../dto/update-user.dto.js';
import { UserEntity } from '../../../domain/user/model/user.entity.js';

@Injectable()
export class UserApplicationService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.findAll();
  }

  async findById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new BusinessException(ErrorCode.USER_NOT_FOUND, `User ${id} not found`, HttpStatus.NOT_FOUND);
    return user;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findByEmail(email);
  }

  async findByGoogleId(googleId: string): Promise<UserEntity | null> {
    return this.userRepository.findByGoogleId(googleId);
  }

  async create(dto: CreateUserDto): Promise<UserEntity> {
    return this.userRepository.create({ email: dto.email, name: dto.name });
  }

  async findOrCreateByGoogle(profile: {
    googleId: string;
    email: string;
    name: string;
    profileImage?: string;
  }): Promise<UserEntity> {
    let user = await this.userRepository.findByGoogleId(profile.googleId);
    if (user) return user;

    user = await this.userRepository.findByEmail(profile.email);
    if (user) {
      return this.userRepository.update(user.id, {
        googleId: profile.googleId,
        provider: 'google',
        profileImage: profile.profileImage,
      });
    }

    return this.userRepository.create({
      email: profile.email,
      name: profile.name,
      googleId: profile.googleId,
      provider: 'google',
      profileImage: profile.profileImage,
    });
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserEntity> {
    await this.findById(id);
    return this.userRepository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    return this.userRepository.delete(id);
  }
}
