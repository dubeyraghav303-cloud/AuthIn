import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);

    async sendEmail(to: string, subject: string, body: string) {
        this.logger.log(`Sending email to ${to} with subject "${subject}"`);
        this.logger.debug(`Body: ${body}`);
        // Integration with SendGrid/SMTP would go here
        return true;
    }

    async sendVerificationEmail(email: string, token: string) {
        const link = `http://localhost:3000/auth/verify?token=${token}`;
        return this.sendEmail(email, 'Verify your email', `Click here to verify: ${link}`);
    }

    async sendPasswordResetEmail(email: string, token: string) {
        const link = `http://localhost:3000/auth/reset-password?token=${token}`;
        return this.sendEmail(email, 'Reset your password', `Click here to reset: ${link}`);
    }
}
