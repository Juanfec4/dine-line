import {
  IsAlpha,
  IsBoolean,
  IsOptional,
  IsPostalCode,
  IsString,
} from 'class-validator';

export class CreateAddressDto {
  @IsAlpha()
  readonly alias: string;

  @IsBoolean()
  readonly isPrimary: boolean;

  @IsString()
  readonly unit: string;

  @IsString()
  readonly addressLine1: string;

  @IsOptional()
  @IsString()
  readonly addressLine2: string;

  @IsString()
  readonly city: string;

  @IsString()
  readonly province: string;

  @IsAlpha()
  readonly country: string;

  @IsPostalCode('any')
  readonly postalCode: string;
}
