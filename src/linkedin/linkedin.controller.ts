// src/linkedin/linkedin.controller.ts
import { Controller, Get, Query, Res,BadRequestException  } from '@nestjs/common';
import { LinkedinService } from './linkedin.service';
import { Response } from 'express';

@Controller('linkdin')
export class LinkedinController {
  constructor(private readonly linkedinService: LinkedinService) {}

  @Get('auth')
  redirectToLinkedIn(@Res() res: Response) {
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const redirectUri = process.env.LINKEDIN_REDIRECT_URI;
    if (!clientId || !redirectUri) {
    throw new BadRequestException('Missing LinkedIn OAuth configuration');
  }
   // const scope = 'r_liteprofile r_emailaddress w_member_social'; // Add relevant scopes for job posting
   const scope = 'w_member_social'
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&scope=${scope}`;

    res.redirect(authUrl);
  }

  @Get('callback')
  async handleCallback(@Query('code') code: string, @Res() res: Response) {
    const tokenData = await this.linkedinService.getAccessToken(code);
    // Store tokenData.access_token for later use
    return res.json({ message: 'Token retrieved', token: tokenData });
  }
}
