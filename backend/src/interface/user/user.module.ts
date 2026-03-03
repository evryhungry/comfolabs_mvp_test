import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserController } from './user.controller.js';
import { UserApplicationService } from '../../application/user/service/user-application.service.js';
import { UserMikroRepository } from '../../infrastructure/persistence/user-mikro.repository.js';
import { USER_REPOSITORY } from '../../domain/user/repository/user.repository.interface.js';
import { UserEntity } from '../../domain/user/model/user.entity.js';

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    UserApplicationService,
    { provide: USER_REPOSITORY, useClass: UserMikroRepository },
  ],
  exports: [UserApplicationService],
})
export class UserModule {}
