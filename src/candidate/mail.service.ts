// mail.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(email: string, name: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to our ATS application',
      template: './welcome', // templates/welcome.hbs
      context: {
        name,
      },
    });
  }

  async sendDynamicEmail(options: { to: string; subject: string; description: string }) {
  await this.mailerService.sendMail({
    to: options.to,
    subject: options.subject,
    html: `<p>${options.description}</p>`,     // if you want HTML body
    // OR use template:
    // template: './generic',
    // context: { description: options.description }
  });
}
}

