import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateMenuItemDto {
  @IsString()
  imageFilePath: string;

  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  description: string;

  @IsBoolean()
  isAvailable: boolean;

  @IsString()
  category: string;
}
