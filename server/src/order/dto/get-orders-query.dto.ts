import { Type } from 'class-transformer';
import { IsOptional, IsInt } from 'class-validator';

export class GetOrdersQueryDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  pageSize: number;
}
