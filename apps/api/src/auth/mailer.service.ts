import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly transport;

  constructor(private readonly configService: ConfigService) {
    this.transport = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST', 'localhost'),
      port: Number(this.configService.get<string>('MAIL_PORT', 1025)),
      secure: false,
    });
  }

  async sendReset(email: string, token: string): Promise<void> {
    await this.transport.sendMail({
      from: this.configService.get<string>('MAIL_FROM', 'no-reply@exchange.local'),
      to: email,
      subject: 'Password reset',
      text: `Reset token: ${token}`,
    });
  }
}
