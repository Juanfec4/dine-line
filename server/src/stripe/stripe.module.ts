import { RawBodyMiddleware } from './../common/middleware/raw-body.middleware';
import {
  MiddlewareConsumer,
  Module,
  RequestMethod,
  forwardRef,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { OrderModule } from 'src/order/order.module';
import { PdfModule } from 'src/pdf/pdf.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [PdfModule, EmailModule, forwardRef(() => OrderModule)],
  providers: [StripeService],
  controllers: [StripeController],
  exports: [StripeService],
})
export class StripeModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RawBodyMiddleware)
      .forRoutes({ path: 'stripe/webhooks', method: RequestMethod.POST });
  }
}
