import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import { Transporter } from 'nodemailer';
import { MAIL_TRANSPORTER } from 'src/common/constants';
import { EmailJob } from 'src/common/interfaces';

@Processor('email')
export class EmailConsumer {
  constructor(
    @Inject(MAIL_TRANSPORTER) private readonly transporter: Transporter,
  ) {}

  @Process('send-email')
  async sendEmail(job: Job<EmailJob>) {
    return this.transporter.sendMail(job.data);
  }

  @OnQueueCompleted()
  onCompleted(job: Job, result: any) {
    console.log(`Email sent, job${job.id} completed.`);
  }
}
