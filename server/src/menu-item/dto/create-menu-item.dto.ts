import { IsBoolean, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateMenuItemDto {
  @IsString()
  readonly imageFilePath: string;

  @IsString()
  readonly name: string;

  @IsNumber()
  readonly price: number;

  @IsString()
  @MaxLength(150)
  readonly description: string;

  @IsBoolean()
  readonly isAvailable: boolean;

  @IsString()
  readonly category: string;
}
