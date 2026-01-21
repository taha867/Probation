import { ConfigService } from '@nestjs/config';
import { EmailSendResultDto } from './dto/email-send-payload.dto';
export declare class EmailService {
    private readonly configService;
    private transporter;
    constructor(configService: ConfigService);
    private initializeTransporter;
    sendPasswordResetEmail(email: string, resetToken: string, userName?: string): Promise<EmailSendResultDto>;
}
//# sourceMappingURL=email.service.d.ts.map