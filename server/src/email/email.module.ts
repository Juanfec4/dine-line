import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TemplateService } from './services/template/template.service';

import { EmailService } from './email.service';

import { BullModule } from '@nestjs/bull';
import { EmailConsumer } from './services/processor/email.processor';
import { MAIL_TRANSPORTER } from 'src/common/constants';
import { createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  providers: [
    TemplateService,
    EmailService,
    EmailConsumer,
    {
      provide: MAIL_TRANSPORTER,
      useFactory: (configService: ConfigService) => {
        const options: SMTPTransport.Options = {
          service: configService.get<string>('mailer.service'),
          host: configService.get<string>('mailer.host'),
          port: configService.get<number>('mailer.port'),
          secure: configService.get<boolean>('mailer.isSecure'),
          auth: {
            user: configService.get<string>('mailer.username'),
            pass: configService.get<string>('mailer.password'),
          },
        };

        const defaults = {
          from: {
            name: 'No-Reply',
            address: configService.get<string>('mail.from'),
          },
        };

        return createTransport(options, defaults);
      },
      inject: [ConfigService],
    },
  ],
  exports: [EmailService],
})
export class EmailModule {}
