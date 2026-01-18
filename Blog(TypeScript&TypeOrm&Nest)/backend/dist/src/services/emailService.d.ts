/**
 * Email service response interface
 * Returned after sending an email
 */
interface EmailSendResult {
    success: boolean;
    messageId?: string;
}
/**
 * Email Service for sending emails
 * Handles SMTP configuration and email templates
 * Uses singleton pattern - single instance manages all email operations
 */
declare class EmailService {
    /**
     * Nodemailer transporter instance
     * Stores SMTP connection details and handles email sending
     * Can be null if initialization fails
     */
    private transporter;
    /**
     * Constructor initializes the email transporter
     * Called when the singleton instance is created
     */
    constructor();
    /**
     * Initialize nodemailer transporter with SMTP configuration
     * Reads environment variables and sets up the email sending engine
     *
     * @returns void - Sets this.transporter or leaves it null on failure
     */
    private initializeTransporter;
    /**
     * Send password reset email
     *
     * @param email - Recipient email address
     * @param resetToken - Password reset token (JWT)
     * @param userName - User's name for personalization (defaults to "User")
     * @returns Promise resolving to email send result
     * @throws Error if transporter is not initialized or email sending fails
     */
    sendPasswordResetEmail(email: string, resetToken: string, userName?: string): Promise<EmailSendResult>;
    /**
     * Generate HTML template for password reset email
     *
     * @param userName - User's name for personalization
     * @param resetLink - Password reset link URL
     * @returns HTML template string
     */
    private getPasswordResetTemplate;
}
export declare const emailService: EmailService;
export {};
//# sourceMappingURL=emailService.d.ts.map