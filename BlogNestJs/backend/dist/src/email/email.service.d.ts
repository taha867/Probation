import { EmailSendResultDto } from './dto/email-send-payload.dto';
export declare class EmailService {
    private transporter;
    private readonly config;
    constructor();
    private initializeTransporter;
    sendPasswordResetEmail(email: string, resetToken: string, userName?: string): Promise<EmailSendResultDto>;
}
//# sourceMappingURL=email.service.d.ts.map