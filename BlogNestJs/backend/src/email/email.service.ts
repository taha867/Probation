import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter, SendMailOptions } from 'nodemailer';
import { EmailSendResultDto } from './dto/email-send-payload.dto';
import { SendPasswordResetEmailDto } from './dto/password-reset-emai-payloadl.dto';
import {
  LOG_MESSAGES,
  EMAIL_TEMPLATES,
  DEFAULTS,
  ERROR_MESSAGES,
} from '../lib/constants';
import {
  getPasswordResetHtmlTemplate,
  getPasswordResetTextTemplate,
} from './templates/password-reset.template';

@Injectable()
export class EmailService {
  private transporter: Transporter | null = null;

  constructor(private readonly configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter(): void {
    try {
      const requiredEnvVars: string[] = [
        'EMAIL_HOST',
        'EMAIL_PORT',
        'EMAIL_USER',
        'EMAIL_PASS',
        'EMAIL_FROM',
      ];

      const missingVars: string[] = requiredEnvVars.filter(
        (varName: string) => !this.configService.get<string>(varName),
      );

      if (missingVars.length > 0) {
        console.error(LOG_MESSAGES.EMAIL_ENV_VARS_MISSING, missingVars);
        return;
      }

      this.transporter = nodemailer.createTransport({
        host: this.configService.get<string>('EMAIL_HOST')!,
        port: this.configService.get<number>('EMAIL_PORT')!,
        secure: this.configService.get<string>('EMAIL_SECURE') === 'true',
        auth: {
          user: this.configService.get<string>('EMAIL_USER')!,
          pass: this.configService.get<string>('EMAIL_PASS')!,
        },
        debug: false,
        logger: false,
      });

      console.log(LOG_MESSAGES.EMAIL_TRANSPORTER_INIT_SUCCESS);
    } catch (error: unknown) {
      console.error(LOG_MESSAGES.EMAIL_TRANSPORTER_INIT_FAILED, error);
    }
  }

  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
    userName: string = DEFAULTS.USER_NAME,
  ): Promise<EmailSendResultDto> {
    // Create DTO for validation
    const emailDto = new SendPasswordResetEmailDto();
    emailDto.email = email;
    emailDto.resetToken = resetToken;
    emailDto.userName = userName || DEFAULTS.USER_NAME;

    if (!this.transporter) {
      console.error(LOG_MESSAGES.EMAIL_TRANSPORTER_NOT_INIT);
      throw new Error(ERROR_MESSAGES.EMAIL_SEND_FAILED);
    }

    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || '';
    const resetLink: string = `${frontendUrl}/reset-password?token=${emailDto.resetToken}`;

    const htmlTemplate: string = getPasswordResetHtmlTemplate(
      emailDto.userName,
      resetLink,
    );

    const textTemplate: string = getPasswordResetTextTemplate(
      emailDto.userName,
      resetLink,
    );

    const mailOptions: SendMailOptions = {
      from: {
        name: EMAIL_TEMPLATES.APP_NAME,
        address: this.configService.get<string>('EMAIL_FROM')!,
      },
      to: emailDto.email,
      subject: EMAIL_TEMPLATES.RESET_PASSWORD_SUBJECT,
      html: htmlTemplate,
      text: textTemplate,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(LOG_MESSAGES.EMAIL_SENT_SUCCESS, info.messageId);
      const result = new EmailSendResultDto();
      result.success = true;
      result.messageId = info.messageId;
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(LOG_MESSAGES.EMAIL_SEND_ERROR, {
          message: error.message,
          name: error.name,
        });
        throw new Error(
          `${ERROR_MESSAGES.EMAIL_SEND_FAILED}: ${error.message}`,
        );
      }
      throw new Error(ERROR_MESSAGES.EMAIL_SEND_FAILED);
    }
  }
}
