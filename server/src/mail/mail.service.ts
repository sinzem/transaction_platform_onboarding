import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    public sendMessage({to, from, subject, text, html = ""}) {
        this.mailerService.sendMail({to, from, subject, text, html})
            .then(() => {
                return "Message sent successfully"
            })
            .catch((e) => {
                return `Sending error: ${e}`  
            });
      }

}
