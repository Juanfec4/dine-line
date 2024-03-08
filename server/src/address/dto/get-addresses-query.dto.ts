import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class GetAddressesQueryDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  pageSize: number;
}
