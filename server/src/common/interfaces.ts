import { Address } from 'src/address/entity/address.entity';
import { OrderItem } from 'src/order/entity/order-item.entity';

export interface EmailJob {
  to: string;
  subject: string;
  html: string;
  attachment?: Attachment;
}

export interface EmailPayload {
  [key: string]: string | number;
}

export interface Attachment {
  filename: string;
  content: Buffer;
  contentType: string;
}

export interface Receipt {
  orderDate: Date;
  address: Address;
  totalPrice: number;
  items: OrderItem[];
}
