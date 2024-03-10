import { StripeService } from './stripe.service';
import { Controller, Header, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}
  @Post('webhooks')
  @Header('Content-Type', 'application/json')
  async handleWebhook(@Req() request: Request, @Res() response: Response) {
    try {
      const event = this.stripeService.validateWebhookSignature(request);

      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object;
          await this.stripeService.sendCheckoutConfirmation(session.id);
      }
      return response.status(200).json({ received: true });
    } catch (error: any) {
      return response.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
}
