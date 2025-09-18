export declare class MailService {
    private resend;
    constructor();
    sendActivationMail(email: string, name: string, uuid: string): Promise<import("resend").CreateEmailResponse>;
}
