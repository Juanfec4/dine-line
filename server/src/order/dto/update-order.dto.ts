import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { IsBoolean } from 'class-validator';
import { Optional } from '@nestjs/common';

export class UpdateOrderDto extends OmitType(PartialType(CreateOrderDto), [
  'orderItemIds',
  'paymentMethod',
] as const) {
  @Optional()
  @IsBoolean()
  isPaid?: boolean;
}
