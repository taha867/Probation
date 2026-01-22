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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = __importStar(require("nodemailer"));
const email_send_payload_dto_1 = require("./dto/email-send-payload.dto");
const password_reset_emai_payloadl_dto_1 = require("./dto/password-reset-emai-payloadl.dto");
const constants_1 = require("../lib/constants");
const password_reset_template_1 = require("./templates/password-reset.template");
const config_1 = __importDefault(require("../config/config"));
let EmailService = class EmailService {
    constructor() {
        this.transporter = null;
        this.config = (0, config_1.default)();
        this.initializeTransporter();
    }
    initializeTransporter() {
        try {
            const emailConfig = this.config.email;
            if (!emailConfig.host || !emailConfig.port || !emailConfig.user || !emailConfig.pass || !emailConfig.from) {
                console.error(constants_1.LOG_MESSAGES.EMAIL_ENV_VARS_MISSING, [
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
            console.log(constants_1.LOG_MESSAGES.EMAIL_TRANSPORTER_INIT_SUCCESS);
        }
        catch (error) {
            console.error(constants_1.LOG_MESSAGES.EMAIL_TRANSPORTER_INIT_FAILED, error);
        }
    }
    async sendPasswordResetEmail(email, resetToken, userName = constants_1.DEFAULTS.USER_NAME) {
        // Create DTO for validation
        const emailDto = new password_reset_emai_payloadl_dto_1.SendPasswordResetEmailDto();
        emailDto.email = email;
        emailDto.resetToken = resetToken;
        emailDto.userName = userName || constants_1.DEFAULTS.USER_NAME;
        if (!this.transporter) {
            console.error(constants_1.LOG_MESSAGES.EMAIL_TRANSPORTER_NOT_INIT);
            throw new Error(constants_1.ERROR_MESSAGES.EMAIL_SEND_FAILED);
        }
        const frontendUrl = this.config.frontendUrl;
        const resetLink = `${frontendUrl}/reset-password?token=${emailDto.resetToken}`;
        const htmlTemplate = (0, password_reset_template_1.getPasswordResetHtmlTemplate)(emailDto.userName, resetLink);
        const textTemplate = (0, password_reset_template_1.getPasswordResetTextTemplate)(emailDto.userName, resetLink);
        const mailOptions = {
            from: {
                name: constants_1.EMAIL_TEMPLATES.APP_NAME,
                address: this.config.email.from,
            },
            to: emailDto.email,
            subject: constants_1.EMAIL_TEMPLATES.RESET_PASSWORD_SUBJECT,
            html: htmlTemplate,
            text: textTemplate,
        };
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log(constants_1.LOG_MESSAGES.EMAIL_SENT_SUCCESS, info.messageId);
            const result = new email_send_payload_dto_1.EmailSendResultDto();
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
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=email.service.js.map