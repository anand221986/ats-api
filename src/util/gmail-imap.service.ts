import { Injectable, Logger } from '@nestjs/common';
import * as imaps from 'imap-simple';
import { google } from 'googleapis';
import { Cron } from '@nestjs/schedule';
import { DbService } from "../db/db.service";
import { UtilService } from "../util/util.service";

@Injectable()
export class GmailImapService {
  private readonly logger = new Logger(GmailImapService.name);
 constructor(
    public dbService: DbService,
    public utilService: UtilService,
  ) 
  {

  }
  // These should ideally be loaded from environment variables
  private readonly clientId = process.env.GMAIL_CLIENT_ID!;
  private readonly clientSecret = process.env.GMAIL_CLIENT_SECRET!;
  private readonly refreshToken = process.env.GMAIL_REFRESH_TOKEN!;
  private readonly email = process.env.GMAIL_EMAIL!;

  async getAccessToken(): Promise<string> {
    const oAuth2Client = new google.auth.OAuth2(this.clientId, this.clientSecret);
    oAuth2Client.setCredentials({ refresh_token: this.refreshToken });

    const { token } = await oAuth2Client.getAccessToken();
    if (!token) {
      throw new Error('Failed to retrieve access token');
    }
    return token;
  }

  async connectToGmail(accessToken: string, email: string): Promise<void> {
    const config = {
      imap: {
        user: email,
        xoauth2: this.buildXOAuth2Token(email, accessToken),
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
        authTimeout: 5000,
        debug: (msg: string) => console.log('IMAP:', msg), // 👈 log everything
      },
    };
    const connection = await imaps.connect(config);
    // await connection.openBox('INBOX');
    // const searchCriteria = ['UNSEEN'];
    // const fetchOptions = { bodies: ['HEADER.FIELDS (FROM SUBJECT DATE)', 'TEXT'], markSeen: false };
    // const messages = await connection.search(searchCriteria, fetchOptions);
    await connection.openBox('[Gmail]/Spam'); // for Gmail
    //await connection.openBox('Inbox'); // for Gmail
    let spamMessages = await connection.search(['UNSEEN'], {
      bodies: ['HEADER.FIELDS (FROM SUBJECT DATE)', 'TEXT'],
      markSeen: false
    });
    for (const msg of spamMessages) {
      const headerPart = msg.parts.find(
        (part) => part.which === 'HEADER.FIELDS (FROM SUBJECT DATE)'
      )?.body;
      const bodyPart = msg.parts.find((part) => part.which === 'TEXT');
      let body = '';
      if (bodyPart) {
        if (typeof bodyPart.body === 'string') {
          body = bodyPart.body;
        } else if (bodyPart.body?.toString) {
          body = bodyPart.body.toString();
        } else {
          body = JSON.stringify(bodyPart.body);
        }
      }
      const subject = headerPart?.subject?.[0] || '(no subject)';
      const from = headerPart?.from?.[0] || '(unknown sender)';
      const date = headerPart?.date?.[0] || null;
      // 👇 Extract the Message-ID
      const messageIdHeader = msg.attributes?.['x-gm-msgid'] || msg.attributes?.uid || null;
      const message_id = messageIdHeader?.toString(); // stringified for safety
      if (!message_id) {
        this.logger.warn('Message without ID skipped');
        continue;
      }
      // Prepare the insert
      const insertData = [
        { set: 'message_id', value: String(message_id) },
        { set: 'sender', value: String(from) },
        { set: 'subject', value: String(subject) },
        { set: 'body', value: String(body) },
        { set: 'received_at', value: new Date(date ?? new Date()).toISOString() },
      ];
      try {
      const insertion = await this.dbService.insertData('conversations', insertData);
      } catch (err) {
        this.logger.error(`Error inserting message ${message_id}:`, err.stack);
      }
    }
    connection.end();

  }

  // Build XOAUTH2 token string
  private buildXOAuth2Token(email: string, accessToken: string): string {
    return Buffer.from(`user=${email}\x01auth=Bearer ${accessToken}\x01\x01`).toString('base64');
  }



  // @Cron('*/1 * * * *') // Every 5 minutes
  // async handleCron(): Promise<void> {
  //   this.logger.log('Cron job triggered: checking Gmail inbox...');

  //   try {
  //     const accessToken = await this.getAccessToken();
  //     await this.connectToGmail(accessToken, this.email);
  //     this.logger.log('Cron job finished successfully ✅');
  //   } catch (error) {
  //     this.logger.error('Cron job failed ❌', error instanceof Error ? error.stack : String(error));
  //   }
  // }
}
