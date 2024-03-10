import { EmailService } from './../email/email.service';
import { PdfService } from './../pdf/pdf.service';
import { OrderService } from './../order/order.service';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import Stripe from 'stripe';
import { OrderItem } from 'src/order/entity/order-item.entity';
import { EmailPriority, EmailSubject, EmailTemplate } from 'src/common/enums';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private webhookSecret: string;

  constructor(
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
    private readonly pdfService: PdfService,
    private readonly emailService: EmailService,
    configService: ConfigService,
  ) {
    this.stripe = new Stripe(configService.get<string>('stripe.secretKey'), {
      apiVersion: '2023-10-16',
    });
    this.webhookSecret = configService.get<string>('stripe.webhookSecret');
  }

  async createCheckoutSession(
    items: OrderItem[],
    currency: string,
    successUrl: string,
    cancelUrl: string,
  ): Promise<Stripe.Checkout.Session> {
    const lineItems = items.map((item) => ({
      price_data: {
        currency,
        product_data: {
          name: item.menuItem.name,
        },
        unit_amount: item.menuItem.price,
      },
      quantity: item.quantity,
    }));

    return this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
  }

  async sendCheckoutConfirmation(sessionId: string) {
    //Get order
    const order = await this.orderService.getBySession(sessionId);

    //Create PDF receipt
    const pdfBuffer = await this.pdfService.create({
      items: order.items,
      orderDate: order.orderDate,
      address: order.deliveryAddress,
      totalPrice: order.totalPrice,
    });

    //Send Order confirmation email
    await this.emailService.send(
      order.user.email,
      EmailTemplate.ORDER_CONFIRMATION,
      EmailSubject.ORDER_CONFIRMATION,
      { firstName: order.user.firstName, orderCode: order.orderCode },
      EmailPriority.HIGH,
      {
        filename: 'receipt.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    );
  }

  validateWebhookSignature(request: any): Stripe.Event {
    const signature = request.headers['stripe-signature'];
    const payload = request.rawBody;

    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.webhookSecret,
      );
    } catch (err) {
      throw new Error(`Webhook Error: ${err.message}`);
    }
  }
}
