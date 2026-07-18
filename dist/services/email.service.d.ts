interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}
export declare function sendEmail(options: SendEmailOptions): Promise<boolean>;
export declare function sendWelcomeEmail(name: string, email: string): Promise<void>;
export declare function sendApplicationSubmittedEmail(candidateName: string, email: string, jobTitle: string, companyName: string): Promise<void>;
export declare function sendApplicationStatusEmail(candidateName: string, email: string, jobTitle: string, status: string): Promise<void>;
export {};
//# sourceMappingURL=email.service.d.ts.map