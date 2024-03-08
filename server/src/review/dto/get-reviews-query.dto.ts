import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { ReviewFilterType } from 'src/common/enums';

export class GetReviewsQueryDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  pageSize: number;

  @IsOptional()
  @IsEnum(ReviewFilterType)
  type: ReviewFilterType;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  searchId: number;
}
