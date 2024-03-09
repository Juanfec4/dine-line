import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class ParamIdDto {
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  id: number;
}
