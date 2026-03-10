import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { OAuthController } from './oauth.controller.js';
import { GoogleStrategy } from '../../infrastructure/auth/google.strategy.js';
import { UserModule } from '../user/user.module.js';

@Module({
  imports: [PassportModule, UserModule],
  controllers: [OAuthController],
  providers: [GoogleStrategy],
})
export class OAuthModule {}
