import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class GetMenuItemsQueryDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  pageSize: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  categoryId: number;
}
