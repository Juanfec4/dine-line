import { IsInt } from 'class-validator';

export class OrderItemDto {
  @IsInt()
  readonly itemId: number;

  @IsInt()
  readonly quantity: number;
}
