import { IsInt } from 'class-validator';

export class CreateFavoriteDto {
  @IsInt()
  readonly menuItemId: number;
}
