import { Injectable } from '@nestjs/common';
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
import appConfig from '../config/config';

@Injectable()
export class EmailService {
  private transporter: Transporter | null = null;
  private readonly config = appConfig();

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter(): void {
    try {
      const emailConfig = this.config.email;

      if (!emailConfig.host || !emailConfig.port || !emailConfig.user || !emailConfig.pass || !emailConfig.from) {
        console.error(LOG_MESSAGES.EMAIL_ENV_VARS_MISSING, [
          !emailConfig.host && 'EMAIL_HOST',
          !emailConfig.port && 'EMAIL_PORT',
          !emailConfig.user && 'EMAIL_USER',
          !emailConfig.pass && 'EMAIL_PASS',
          !emailConfig.from && 'EMAIL_FROM',
        ].filter(Boolean));
        return;
      }

      this.transporter = nodemailer.createTransport({
        host: emailConfig.host,
        port: emailConfig.port,
        secure: emailConfig.secure,
        auth: {
          user: emailConfig.user,
          pass: emailConfig.pass,
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

    const frontendUrl = this.config.frontendUrl;
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
        address: this.config.email.from,
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
