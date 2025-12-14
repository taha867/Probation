import nodemailer from "nodemailer";

/**
 * Email Service for sending emails
 * Handles SMTP configuration and email templates
 */
class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  /**
   * Initialize nodemailer transporter with SMTP configuration
   */
  initializeTransporter() {
    try {
      // Validate required environment variables
      const requiredEnvVars = [
        "EMAIL_HOST",
        "EMAIL_PORT",
        "EMAIL_USER",
        "EMAIL_PASS",
        "EMAIL_FROM",
      ];
      const missingVars = requiredEnvVars.filter(
        (varName) => !process.env[varName],
      );

      if (missingVars.length > 0) {
        console.error(
          "Missing required email environment variables:",
          missingVars,
        );
        return;
      }

      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        debug: true, // Enable debug output
        logger: true, // Log to console
      });

      console.log("Email transporter initialized successfully");
      console.log("Email config:", {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER,
        from: process.env.EMAIL_FROM,
      });
    } catch (error) {
      console.error("Failed to initialize email transporter:", error);
    }
  }

  /**
   * Send password reset email
   * @param {string} email - Recipient email address
   * @param {string} resetToken - Password reset token
   * @param {string} userName - User's name for personalization
   */
  async sendPasswordResetEmail(email, resetToken, userName = "User") {
    if (!this.transporter) {
      console.error(
        "Email transporter not initialized - check environment variables",
      );
      throw new Error("Email transporter not initialized");
    }

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const htmlTemplate = this.getPasswordResetTemplate(userName, resetLink);

    const mailOptions = {
      from: {
        name: "Blog App",
        address: process.env.EMAIL_FROM,
      },
      to: email,
      subject: "Reset Your Password - Blog App",
      html: htmlTemplate,
      text: `Hello ${userName},\n\nYou requested to reset your password. Click the link below to reset it:\n\n${resetLink}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nBlog App Team`,
    };

    try {
      console.log("Attempting to send email to:", email);
      console.log("Reset link:", resetLink);

      const info = await this.transporter.sendMail(mailOptions);
      console.log("Password reset email sent successfully:", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("Detailed email error:", {
        message: error.message,
        code: error.code,
        command: error.command,
        response: error.response,
        responseCode: error.responseCode,
      });
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }
  }

  /**
   * Generate HTML template for password reset email
   * @param {string} userName - User's name
   * @param {string} resetLink - Password reset link
   * @returns {string} HTML template
   */
  getPasswordResetTemplate(userName, resetLink) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background-color: #ffffff;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 24px;
                font-weight: bold;
                color: #2563eb;
                margin-bottom: 10px;
            }
            .title {
                color: #1f2937;
                margin-bottom: 20px;
            }
            .content {
                margin-bottom: 30px;
            }
            .reset-button {
                display: inline-block;
                background-color: #2563eb;
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin: 20px 0;
            }
            .reset-button:hover {
                background-color: #1d4ed8;
            }
            .warning {
                background-color: #fef3c7;
                border: 1px solid #f59e0b;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                color: #6b7280;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">📝 Blog App</div>
                <h1 class="title">Reset Your Password</h1>
            </div>
            
            <div class="content">
                <p>Hello <strong>${userName}</strong>,</p>
                
                <p>You recently requested to reset your password for your Blog App account. Click the button below to reset it:</p>
                
                <div style="text-align: center;">
                    <a href="${resetLink}" class="reset-button">Reset My Password</a>
                </div>
                
                <div class="warning">
                    <strong>⚠️ Important:</strong> This link will expire in <strong>1 hour</strong> for security reasons.
                </div>
                
                <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 5px;">
                    ${resetLink}
                </p>
                
                <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
            </div>
            
            <div class="footer">
                <p>Best regards,<br>The Blog App Team</p>
                <p>This is an automated email. Please do not reply to this message.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  /**
   * Test email configuration
   * @returns {Promise<boolean>} True if configuration is valid
   */
  async testConnection() {
    if (!this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      console.log("Email configuration is valid");
      return true;
    } catch (error) {
      console.error("Email configuration test failed:", error);
      return false;
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();
