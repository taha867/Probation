export declare class EmailService {
    private transporter;
    constructor();
    private initializeTransporter;
    sendPasswordResetEmail(email: string, resetToken: string, userName?: string): Promise<{
        success: boolean;
        messageId?: string;
    }>;
    private getPasswordResetTemplate;
}
//# sourceMappingURL=email.service.d.ts.map