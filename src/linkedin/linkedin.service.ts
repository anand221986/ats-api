import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import * as qs from 'qs';

@Injectable()
export class LinkedinService {
  private clientId = process.env.LINKEDIN_CLIENT_ID;
  private clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  private redirectUri = process.env.LINKEDIN_REDIRECT_URI;

  async getAccessToken(code: string): Promise<any> {
    const data = qs.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.redirectUri,
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });

    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

    const response = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', data, { headers });
    return response.data; // contains access_token and expires_in
  }

  async postJob(accessToken: string, jobData: any): Promise<any> {
    // This assumes you're an approved LinkedIn Partner with API access
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    };

    const response = await axios.post('https://api.linkedin.com/v2/jobs', jobData, { headers });
    return response.data;
  }
}
