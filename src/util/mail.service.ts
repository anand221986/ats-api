import { Injectable, Logger } from '@nestjs/common';
import * as imaps from 'imap-simple';
import { simpleParser } from 'mailparser';
import * as fs from 'fs';
import * as path from 'path';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class IMailService {
  private readonly logger = new Logger(IMailService.name);

  async checkMails() {
    const config = {
      imap: {
        user: process.env.MAIL_USER,
        password: process.env.MAIL_PASS,
       host: 'imap.gmail.com',
       port: 993,
       tls: true,
//        tlsOptions: {
//     rejectUnauthorized: false, // 👈 allows Gmail’s cert
//   },
       //tlsOptions: { rejectUnauthorized: false }, 
        authTimeout: 3000,
      },
    };

    try {
      const connection = await imaps.connect(config);
      await connection.openBox('INBOX');

      // Search unseen mails
      const searchCriteria = ['UNSEEN'];
      const fetchOptions = { bodies: ['HEADER', 'TEXT'], struct: true };

      const messages = await connection.search(searchCriteria, fetchOptions);

      for (const message of messages) {
        const all = message.parts.find((p) => p.which === 'TEXT');
        const raw = all?.body || '';
        const parsed = await simpleParser(raw);

        this.logger.log(`New email from: ${parsed.from?.text}, subject: ${parsed.subject}`);

        if (parsed.attachments && parsed.attachments.length > 0) {
          for (const attachment of parsed.attachments) {
            const filePath = path.join(__dirname, `../../uploads/${attachment.filename}`);
            fs.writeFileSync(filePath, attachment.content);
            this.logger.log(`Saved attachment: ${attachment.filename}`);

            // 👉 Here: save candidate + CV in ATS DB
            // await this.candidateService.createFromEmail({
            //   name: parsed.from?.text,
            //   email: parsed.from?.value[0].address,
            //   cvPath: filePath,
            // });
          }
        }
      }
    } catch (err) {
      this.logger.error('Error checking mails', err);
    }
  }

// @Cron('*/1 * * * *') // every 5 minutes
//   async handleCron() {
//     this.logger.log('Cron job triggered: checking mails...');

//     try {
//       await this.checkMails();
//       this.logger.log('Cron job finished successfully ✅');
//     } catch (error) {
//       this.logger.error('Cron job failed ❌', error.stack);
//     }
//   }
}
