export declare class ContactService {
    submitContact(input: {
        name: string;
        email: string;
        subject: string;
        message: string;
    }): Promise<{
        received: boolean;
    }>;
    subscribeNewsletter(email: string): Promise<{
        subscribed: boolean;
    }>;
}
export declare const contactService: ContactService;
//# sourceMappingURL=contact.service.d.ts.map