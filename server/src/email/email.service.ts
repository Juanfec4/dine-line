import { TemplateService } from './services/template/template.service';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { EmailPriority, EmailSubject, EmailTemplate } from 'src/common/enums';
import { Attachment, EmailJob, EmailPayload } from 'src/common/interfaces';

@Injectable()
export class EmailService {
  constructor(
    @InjectQueue('email') private readonly emailQueue: Queue,
    private readonly templateService: TemplateService,
  ) {}

  async send(
    recipientEmail: string,
    template: EmailTemplate,
    subject: EmailSubject,
    payload: EmailPayload,
    priority: EmailPriority,
    attachment?: Attachment,
  ) {
    //Construct email HTML
    const emailHtml = await this.templateService.createHTML(template, payload);

    //Construct email envelope
    const email: EmailJob = {
      to: recipientEmail,
      subject,
      html: emailHtml,
    };

    if (attachment) email.attachment = attachment;

    //Add job to queue
    await this.emailQueue.add('send-email', email, { priority });
  }
}
