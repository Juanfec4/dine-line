import { Type } from 'class-transformer';
import { IsEnum, IsInt, ValidateNested } from 'class-validator';
import { PaymentMethods } from 'src/common/enums';
import { OrderItem } from '../entity/order-item.entity';
import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
  @IsEnum(PaymentMethods)
  readonly paymentMethod: PaymentMethods;

  @IsInt()
  readonly deliveryAddressId: number;

  @ValidateNested({ each: true })
  @Type(() => OrderItem)
  readonly orderItemIds: OrderItemDto[];
}
