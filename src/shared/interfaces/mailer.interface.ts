export interface MailerInterface {
    to: string;
    from: string;
    subject: string;
    text: string;
}