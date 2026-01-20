"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = __importStar(require("nodemailer"));
const emailSendResult_dto_1 = require("./dto/emailSendResult.dto");
const sendPasswordResetEmail_dto_1 = require("./dto/sendPasswordResetEmail.dto");
const constants_1 = require("../lib/constants");
let EmailService = class EmailService {
    constructor() {
        this.transporter = null;
        this.initializeTransporter();
    }
    initializeTransporter() {
        try {
            const requiredEnvVars = [
                'EMAIL_HOST',
                'EMAIL_PORT',
                'EMAIL_USER',
                'EMAIL_PASS',
                'EMAIL_FROM',
            ];
            const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
            if (missingVars.length > 0) {
                console.error(constants_1.LOG_MESSAGES.EMAIL_ENV_VARS_MISSING, missingVars);
                return;
            }
            this.transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: parseInt(process.env.EMAIL_PORT, 10),
                secure: process.env.EMAIL_SECURE === 'true',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
                debug: false,
                logger: false,
            });
            console.log(constants_1.LOG_MESSAGES.EMAIL_TRANSPORTER_INIT_SUCCESS);
        }
        catch (error) {
            console.error(constants_1.LOG_MESSAGES.EMAIL_TRANSPORTER_INIT_FAILED, error);
        }
    }
    async sendPasswordResetEmail(email, resetToken, userName = constants_1.DEFAULTS.USER_NAME) {
        // Create DTO for validation
        const emailDto = new sendPasswordResetEmail_dto_1.SendPasswordResetEmailDto();
        emailDto.email = email;
        emailDto.resetToken = resetToken;
        emailDto.userName = userName || constants_1.DEFAULTS.USER_NAME;
        if (!this.transporter) {
            console.error(constants_1.LOG_MESSAGES.EMAIL_TRANSPORTER_NOT_INIT);
            throw new Error(constants_1.ERROR_MESSAGES.EMAIL_SEND_FAILED);
        }
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${emailDto.resetToken}`;
        const htmlTemplate = this.getPasswordResetTemplate(emailDto.userName, resetLink);
        const mailOptions = {
            from: {
                name: constants_1.EMAIL_TEMPLATES.APP_NAME,
                address: process.env.EMAIL_FROM,
            },
            to: emailDto.email,
            subject: constants_1.EMAIL_TEMPLATES.RESET_PASSWORD_SUBJECT,
            html: htmlTemplate,
            text: `${constants_1.EMAIL_TEMPLATES.RESET_PASSWORD_GREETING} ${emailDto.userName},\n\n${constants_1.EMAIL_TEMPLATES.RESET_PASSWORD_TEXT_INTRO}\n\n${resetLink}\n\n${constants_1.EMAIL_TEMPLATES.RESET_PASSWORD_TEXT_EXPIRY}\n\n${constants_1.EMAIL_TEMPLATES.RESET_PASSWORD_TEXT_IGNORE}\n\n${constants_1.EMAIL_TEMPLATES.RESET_PASSWORD_CLOSING}\n${constants_1.EMAIL_TEMPLATES.RESET_PASSWORD_TEAM}`,
        };
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log(constants_1.LOG_MESSAGES.EMAIL_SENT_SUCCESS, info.messageId);
            const result = new emailSendResult_dto_1.EmailSendResultDto();
            result.success = true;
            result.messageId = info.messageId;
            return result;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(constants_1.LOG_MESSAGES.EMAIL_SEND_ERROR, {
                    message: error.message,
                    name: error.name,
                });
                throw new Error(`${constants_1.ERROR_MESSAGES.EMAIL_SEND_FAILED}: ${error.message}`);
            }
            throw new Error(constants_1.ERROR_MESSAGES.EMAIL_SEND_FAILED);
        }
    }
    getPasswordResetTemplate(userName, resetLink) {
        return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${constants_1.EMAIL_TEMPLATES.RESET_PASSWORD_TITLE}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; padding: 30px;">
          <tr>
            <td align="center" style="padding-bottom: 20px;">
              <div style="font-size: 24px; font-weight: bold; color: #2563eb;">📝 ${constants_1.EMAIL_TEMPLATES.APP_NAME}</div>
              <h1 style="margin: 10px 0 0; font-size: 22px; color: #1f2937;">${constants_1.EMAIL_TEMPLATES.RESET_PASSWORD_TITLE}</h1>
            </td>
          </tr>
          <tr>
            <td style="font-size: 16px; color: #374151;">
              <p>${constants_1.EMAIL_TEMPLATES.RESET_PASSWORD_GREETING} <strong>${userName}</strong>,</p>
              <p>${constants_1.EMAIL_TEMPLATES.RESET_PASSWORD_INTRO}</p>
              <table align="center" cellpadding="0" cellspacing="0" style="margin: 30px auto;">
                <tr>
                  <td bgcolor="#2563eb" style="border-radius: 6px; padding: 14px 32px;">
                    <a href="${resetLink}" style="color: #ffffff !important; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">${constants_1.EMAIL_TEMPLATES.RESET_PASSWORD_BUTTON}</a>
                  </td>
                </tr>
              </table>
              <div style="background-color: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 5px; margin: 20px 0; font-size: 14px;">
                <strong>${constants_1.EMAIL_TEMPLATES.RESET_PASSWORD_WARNING}</strong> ${constants_1.EMAIL_TEMPLATES.RESET_PASSWORD_EXPIRY} <strong>${constants_1.EMAIL_TEMPLATES.RESET_PASSWORD_EXPIRY_TIME}</strong>.
              </div>
              <p>${constants_1.EMAIL_TEMPLATES.RESET_PASSWORD_FALLBACK}</p>
              <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 5px; font-size: 14px;">${resetLink}</p>
              <p>${constants_1.EMAIL_TEMPLATES.RESET_PASSWORD_IGNORE}</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top: 30px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">
              <p style="margin: 0;">${constants_1.EMAIL_TEMPLATES.RESET_PASSWORD_CLOSING}<br /><strong>${constants_1.EMAIL_TEMPLATES.RESET_PASSWORD_TEAM}</strong></p>
              <p style="margin: 8px 0 0;">${constants_1.EMAIL_TEMPLATES.RESET_PASSWORD_AUTO}</p>
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
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=email.service.js.map