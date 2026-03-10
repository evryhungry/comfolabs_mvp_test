import { Controller, Get, Req, Res, UseGuards, Logger } from '@nestjs/common';
import { GoogleOAuthGuard } from '../../infrastructure/auth/google-oauth.guard.js';
import { UserApplicationService } from '../../application/user/service/user-application.service.js';
import type { Request, Response } from 'express';

@Controller('oauth')
export class OAuthController {
  private readonly logger = new Logger(OAuthController.name);

  constructor(private readonly userService: UserApplicationService) {}

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  googleLogin() {
    // Guard redirects to Google
  }

  @Get('google/redirect')
  @UseGuards(GoogleOAuthGuard)
  async googleRedirect(@Req() req: Request, @Res() res: Response) {
    const frontendUrl = process.env.CORS_ORIGIN || 'http://localhost:5173';

    try {
      const googleUser = req.user as {
        googleId: string;
        email: string;
        name: string;
        profileImage?: string;
      };

      const user = await this.userService.findOrCreateByGoogle(googleUser);
      const userData = encodeURIComponent(JSON.stringify(user));
      res.redirect(`${frontendUrl}/oauth/callback?data=${userData}`);
    } catch (e) {
      this.logger.error('Google OAuth failed', e);
      res.redirect(`${frontendUrl}/login?error=oauth_failed`);
    }
  }
}
