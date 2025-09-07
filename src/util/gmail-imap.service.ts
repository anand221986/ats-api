import { Injectable, Logger } from '@nestjs/common';
import * as imaps from 'imap-simple';
import { google } from 'googleapis';
import { Cron } from '@nestjs/schedule';
import { DbService } from "../db/db.service";
import { UtilService } from "../util/util.service";

@Injectable()
export class GmailImapService {
  private oauth2Client;
  private readonly logger = new Logger(GmailImapService.name);
 constructor(
    public dbService: DbService,
    public utilService: UtilService,
  ) 
  {


this.oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI, // e.g. "https://yourapp.com/api/gmail/callback"
    );

        console.log( process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI)
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

//   async connectToGmail(accessToken: string, email: string,candidateId:number): Promise<void> {
//     const config = {
//       imap: {
//         user: email,
//         xoauth2: this.buildXOAuth2Token(email, accessToken),
//         host: 'imap.gmail.com',
//         port: 993,
//         tls: true,
//         tlsOptions: { rejectUnauthorized: false },
//         authTimeout: 5000,
//         debug: (msg: string) => console.log('IMAP:', msg), // 👈 log everything
//       },
//     };
//      const connection = await imaps.connect(config);
//      try {
//     // const searchCriteria = ['UNSEEN'];
//     // const fetchOptions = { bodies: ['HEADER.FIELDS (FROM SUBJECT DATE)', 'TEXT'], markSeen: false };
//     // const messages = await connection.search(searchCriteria, fetchOptions);
//     await connection.openBox('[Gmail]/Spam'); // for Gmail
//     //await connection.openBox('Inbox'); // for Gmail
//     let spamMessages = await connection.search(['UNSEEN'], {
//       bodies: ['HEADER.FIELDS (FROM SUBJECT DATE)', 'TEXT'],
//       markSeen: false
//     });
//     for (const msg of spamMessages) {
//       const headerPart = msg.parts.find(
//         (part) => part.which === 'HEADER.FIELDS (FROM SUBJECT DATE)'
//       )?.body;
//       const bodyPart = msg.parts.find((part) => part.which === 'TEXT');
//       let body = '';
//       if (bodyPart) {
//         if (typeof bodyPart.body === 'string') {
//           body = bodyPart.body;
//         } else if (bodyPart.body?.toString) {
//           body = bodyPart.body.toString();
//         } else {
//           body = JSON.stringify(bodyPart.body);
//         }
//       }
//       const subject = headerPart?.subject?.[0] || '(no subject)';
//       const from = headerPart?.from?.[0] || '(unknown sender)';
//       const date = headerPart?.date?.[0] || null;
//       // 👇 Extract the Message-ID
//       const messageIdHeader = msg.attributes?.['x-gm-msgid'] || msg.attributes?.uid || null;
//       const message_id = messageIdHeader?.toString(); // stringified for safety
//       if (!message_id) {
//         this.logger.warn('Message without ID skipped');
//         continue;
//       }
//       // Prepare the insert
//       const insertData = [
//         { set: 'message_id', value: String(message_id) },
//         { set: 'sender', value: String(from) },
//         { set: 'subject', value: String(subject) },
//         { set: 'body', value: String(body) },
//         { set: 'candidate_id', value: candidateId },
//         { set: 'recruiter_id', value: candidateId },
//         { set: 'received_at', value: new Date(date ?? new Date()).toISOString() },
//       ];
//       try {
//       const insertion = await this.dbService.insertData('conversations', insertData);
//       } catch (err) {
//         this.logger.error(`Error inserting message ${message_id}:`, err.stack);
//       }
//     }
//     connection.end();
//   }catch (err) {
//     this.logger.error('Error connecting to Gmail or processing messages:', err.stack || err.message);
//   } finally {
//     if (connection) {
//       try {
//         connection.end(); // Always close IMAP connection
//       } catch (closeErr) {
//         this.logger.warn('Failed to close IMAP connection:', closeErr);
//       }
//     }
//   }

//   }

//   // Build XOAUTH2 token string
//   private buildXOAuth2Token(email: string, accessToken: string): string {
//     return Buffer.from(`user=${email}\x01auth=Bearer ${accessToken}\x01\x01`).toString('base64');
//   }

// start job syncing 
//  async startSyncJob(candidateId: number): Promise<void> {
//     this.logger.log(`Sync job triggered by candidateId: ${candidateId}`);
//     const accessToken = await this.getAccessToken();
//     let runCount = 0;
//     const interval = setInterval(async () => {
//       try {
//         runCount++;
//         this.logger.log(`Running Gmail sync attempt #${runCount}...`);
//          setImmediate(async () => {
//        await this.connectToGmail(accessToken, this.email,candidateId);
//          })
        
//         if (runCount >= 5) { // 5 iterations = ~5 minutes if 1-min gap
//           clearInterval(interval);
//           this.logger.log('✅ Sync process completed.');
//           // Send mail notification for completion
//           // await this.utilService.sendMail({
//           //   to: this.email, // or admin/recruiter email
//           //   subject: 'Gmail Sync Completed',
//           //   text: `The Gmail sync for candidate ${candidateId} has completed successfully.`,
//           // });
//         }
//       } catch (err) {
//         this.logger.error(`Sync attempt failed: ${err.message}`, err.stack);
//       }
//     }, 60 * 1000); // 1 minute interval
//   }

   async getUserToken(userId: number) {
    const query = `SELECT id, email, google_access_token, google_refresh_token ,token_expiry
                   FROM users WHERE id='${userId}'`;
    const list: any = await this.dbService.execute(query);
    return list[0];
  }

 
  async ensureValidToken(userId: number, user: any) {
     const userDetails = await this.getUserToken(user.email);
     console.log(userDetails,'userdetails')
  this.oauth2Client.setCredentials({
    access_token: user.google_access_token,
    refresh_token: user.google_refresh_token,
  });
  // If access token is expired, refresh it
  if (user.token_expiry && new Date(user.token_expiry) < new Date()) {
    const newTokens = await this.oauth2Client.refreshAccessToken();
    const { access_token, expiry_date } = newTokens.credentials;
    const updateQuery = `
      UPDATE users
      SET google_access_token='${access_token}',
          token_expiry='${expiry_date ? new Date(expiry_date).toISOString() : null}'
      WHERE id='${userId}'
    `;
    console.log(updateQuery,'update query')
    await this.dbService.execute(updateQuery);
  }
}




 getGoogleAuthUrl(userId: Number) {
  //  'https://www.googleapis.com/auth/gmail.metadata',
    const scopes = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/userinfo.email'
];
    const url = this.oauth2Client.generateAuthUrl({
      access_type: 'offline', // refresh tokens enabled
      prompt: 'consent',      // always ask consent (to refresh token)
      scope: scopes,
      state: JSON.stringify({ userId }), // you can decode it later in callback
    });
    return url;
  }
  async syncEmail(userId: number) {
  // 1. Get stored Google tokens
  const user = await this.getUserToken(userId);
  if (!user?.google_access_token) {
    throw new Error(`No Google access token found for user ${userId}`);
  }
  // 2. Set credentials for OAuth2 client
  this.oauth2Client.setCredentials({
    access_token: user.google_access_token,
    refresh_token: user.google_refresh_token,
  });
  const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
  try {
    // 3. Fetch list of messages
    const res = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 5,
    });
    const messages = res.data.messages ?? [];
    if (messages.length === 0) {
      console.log('No messages found');
      return [];
    }
    // 4. Fetch details for each message
    const detailedMessages = await Promise.all(
      messages.map(async (m) => {
        const msgRes = await gmail.users.messages.get({
          userId: 'me',
          id: m.id!,
          format: 'full',
        });

        const payload = msgRes.data.payload;
        const headers = payload?.headers ?? [];

        // Extract subject & from
        const subject =
          headers.find((h) => h.name === 'Subject')?.value || '(no subject)';
        const from = headers.find((h) => h.name === 'From')?.value || '';

        // Extract plain text body
        let body = '';
        if (payload?.parts) {
          const part = payload.parts.find((p) => p.mimeType === 'text/plain');
          if (part?.body?.data) {
            body = Buffer.from(part.body.data, 'base64').toString('utf-8');
          }
        } else if (payload?.body?.data) {
          body = Buffer.from(payload.body.data, 'base64').toString('utf-8');
        }
        const insertData = [
        { set: 'message_id', value: String(m.id) },
        { set: 'sender', value: String(from) },
        { set: 'subject', value: String(subject) },
        { set: 'body', value: String(body) },
        { set: 'candidate_id', value: userId },
        { set: 'recruiter_id', value: userId },
        { set: 'received_at', value: new Date(new Date()).toISOString() },
      ];
      try {
      const insertion = await this.dbService.insertData('conversations', insertData);
      } catch (err) {
        this.logger.error(`Error inserting message ${m.id}:`, err.stack);
      }
        return {
          id: m.id,
          threadId: m.threadId,
          subject,
          from,
          body,
        };
      })
      
    );





    console.log('Fetched detailed messages:', detailedMessages);
    return detailedMessages;
  } catch (err) {
    console.error('Error fetching Gmail messages:', err.message);
    throw err;
  }
}

async startSyncJobAlter(userId: number) {
  const syncInterval = setInterval(async () => {
    try {
      await this.syncEmail(userId);
    } catch (err) {
      this.logger.error(`Error syncing inbox for user ${userId}`, err.stack);
    }
  }, 60 * 1000); // run every 1 minute

  // Stop after 5 minutes
  setTimeout(() => clearInterval(syncInterval), 5 * 60 * 1000);
}
async handleOAuthCallback(code: string, userId: string) {
  const { tokens } = await this.oauth2Client.getToken(code);

  // Persist tokens in DB
  const updateQuery = `
    UPDATE users 
    SET google_access_token='${tokens.access_token}', 
        google_refresh_token='${tokens.refresh_token}',
        token_expiry='${tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null}'
    WHERE id='${userId}'
  `;
  console.log(updateQuery,'updateQuery')
  await this.dbService.execute(updateQuery);

  return tokens;
}


}
