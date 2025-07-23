import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST', 'smtp.gmail.com'),
      port: this.configService.get('SMTP_PORT', 587),
      secure: false,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendLeadNotification(leadData: {
    name: string;
    email: string;
    subject: string;
    phone?: string;
    message: string;
  }): Promise<void> {
    const ownerEmail = this.configService.get('OWNER_EMAIL');
    
    const htmlContent = `
    <h2>New Lead Notification</h2>
          <h3>Contact Details:</h3>
          <h3>Name: ${leadData.name}</h3>
          <h3>Email:<a href="mailto:${leadData.email}">${leadData.email}</a></h3>
          <h3>Subject:${leadData.subject}</h3>
          ${leadData.phone ? `<h3>Phone:<a href="tel:${leadData.phone}">${leadData.phone}</a></h3>` : ''}
          <h3>Message:</h3><h3>${leadData.message}</h3>
    `;

    const mailOptions = {
      from: this.configService.get('SMTP_FROM_EMAIL'),
      to: ownerEmail,
      subject: `New Lead: ${leadData.subject}`,
      html: htmlContent,
      replyTo: leadData.email,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Lead notification email sent successfully');
    } catch (error) {
      console.error('Error sending lead notification email:', error);
      throw new Error('Failed to send email notification');
    }
  }

  async sendThankYouEmail(leadData: {
    name: string;
    email: string;
    subject: string;
  }): Promise<void> {
    const htmlContent = `
        <h2>Thank You for Contacting Us </h2>
        <h2>Hello ${leadData.name},</h2>
        <h2>We have received your message and our team will get back to you soon.</h2>
    `;

    const mailOptions = {
      from: this.configService.get('SMTP_FROM_EMAIL'),
      to: leadData.email,
      subject: `Thank you for contacting us - ${leadData.subject}`,
      html: htmlContent,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Thank you email sent successfully');
    } catch (error) {
      console.error('Error sending thank you email:', error);
    }
  }
} 