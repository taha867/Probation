import { EmailSendResultDto } from './dto/emailSendResult.dto';
export declare class EmailService {
    private transporter;
    constructor();
    private initializeTransporter;
    sendPasswordResetEmail(email: string, resetToken: string, userName?: string): Promise<EmailSendResultDto>;
    private getPasswordResetTemplate;
}
//# sourceMappingURL=email.service.d.ts.map