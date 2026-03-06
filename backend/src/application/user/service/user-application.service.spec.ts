import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UserApplicationService } from './user-application.service.js';
import { USER_REPOSITORY } from '../../../domain/user/repository/user.repository.interface.js';

const mockUserRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('UserApplicationService', () => {
  let service: UserApplicationService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserApplicationService,
        { provide: USER_REPOSITORY, useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UserApplicationService>(UserApplicationService);
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [
        { id: '1', email: 'a@test.com', name: 'A', createdAt: new Date(), updatedAt: new Date() },
        { id: '2', email: 'b@test.com', name: 'B', createdAt: new Date(), updatedAt: new Date() },
      ];
      mockUserRepository.findAll.mockResolvedValue(users);

      const result = await service.findAll();
      expect(result).toEqual(users);
      expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const user = { id: '1', email: 'a@test.com', name: 'A', createdAt: new Date(), updatedAt: new Date() };
      mockUserRepository.findById.mockResolvedValue(user);

      const result = await service.findById('1');
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(service.findById('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a user with email and name', async () => {
      const dto = { email: 'new@test.com', name: 'New User' };
      const created = { id: '3', ...dto, createdAt: new Date(), updatedAt: new Date() };
      mockUserRepository.create.mockResolvedValue(created);

      const result = await service.create(dto);

      expect(result).toEqual(created);
      expect(mockUserRepository.create).toHaveBeenCalledWith({ email: dto.email, name: dto.name });
    });
  });

  describe('update', () => {
    it('should update user after checking existence', async () => {
      const existing = { id: '1', email: 'a@test.com', name: 'A', createdAt: new Date(), updatedAt: new Date() };
      const updated = { ...existing, name: 'Updated' };
      mockUserRepository.findById.mockResolvedValue(existing);
      mockUserRepository.update.mockResolvedValue(updated);

      const result = await service.update('1', { name: 'Updated' });

      expect(result.name).toBe('Updated');
      expect(mockUserRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when updating non-existent user', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(service.update('999', { name: 'X' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete user after checking existence', async () => {
      mockUserRepository.findById.mockResolvedValue({ id: '1' });
      mockUserRepository.delete.mockResolvedValue(undefined);

      await service.delete('1');

      expect(mockUserRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when deleting non-existent user', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(service.delete('999')).rejects.toThrow(NotFoundException);
    });
  });
});
