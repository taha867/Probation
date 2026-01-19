import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter, SendMailOptions } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter | null = null;

  constructor() {
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
        (varName: string) => !process.env[varName]
      );

      if (missingVars.length > 0) {
        console.error(
          'Missing required email environment variables:',
          missingVars
        );
        return;
      }

      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST as string,
        port: parseInt(process.env.EMAIL_PORT as string, 10),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER as string,
          pass: process.env.EMAIL_PASS as string,
        },
        debug: false,
        logger: false,
      });

      console.log('Email transporter initialized successfully');
    } catch (error: unknown) {
      console.error('Failed to initialize email transporter:', error);
    }
  }

  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
    userName: string = 'User'
  ): Promise<{ success: boolean; messageId?: string }> {
    if (!this.transporter) {
      console.error(
        'Email transporter not initialized - check environment variables'
      );
      throw new Error('Email transporter not initialized');
    }

    const resetLink: string = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const htmlTemplate: string = this.getPasswordResetTemplate(userName, resetLink);

    const mailOptions: SendMailOptions = {
      from: {
        name: 'Blog App',
        address: process.env.EMAIL_FROM as string,
      },
      to: email,
      subject: 'Reset Your Password - Blog App',
      html: htmlTemplate,
      text: `Hello ${userName},\n\nYou requested to reset your password. Click the link below to reset it:\n\n${resetLink}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nBlog App Team`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Detailed email error:', {
          message: error.message,
          name: error.name,
        });
        throw new Error(`Failed to send password reset email: ${error.message}`);
      }
      throw new Error('Failed to send password reset email: Unknown error');
    }
  }

  private getPasswordResetTemplate(userName: string, resetLink: string): string {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Reset Your Password</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; padding: 30px;">
          <tr>
            <td align="center" style="padding-bottom: 20px;">
              <div style="font-size: 24px; font-weight: bold; color: #2563eb;">📝 Blog App</div>
              <h1 style="margin: 10px 0 0; font-size: 22px; color: #1f2937;">Reset Your Password</h1>
            </td>
          </tr>
          <tr>
            <td style="font-size: 16px; color: #374151;">
              <p>Hello <strong>${userName}</strong>,</p>
              <p>You requested to reset your password. Click the button below to set a new password.</p>
              <table align="center" cellpadding="0" cellspacing="0" style="margin: 30px auto;">
                <tr>
                  <td bgcolor="#2563eb" style="border-radius: 6px; padding: 14px 32px;">
                    <a href="${resetLink}" style="color: #ffffff !important; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">Reset My Password</a>
                  </td>
                </tr>
              </table>
              <div style="background-color: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 5px; margin: 20px 0; font-size: 14px;">
                <strong>⚠️ Important:</strong> This link will expire in <strong>1 hour</strong>.
              </div>
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 5px; font-size: 14px;">${resetLink}</p>
              <p>If you did not request this password reset, you can safely ignore this email.</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top: 30px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">
              <p style="margin: 0;">Best regards,<br /><strong>Blog App Team</strong></p>
              <p style="margin: 8px 0 0;">This is an automated email. Please do not reply.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }
}

