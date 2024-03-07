import {
  IsAlpha,
  IsAlphanumeric,
  IsEmail,
  IsStrongPassword,
} from 'class-validator';

export class RegisterDto {
  @IsAlpha()
  readonly firstName: string;

  @IsAlpha()
  readonly lastName: string;

  @IsAlphanumeric()
  readonly username: string;

  @IsEmail()
  readonly email: string;

  @IsStrongPassword()
  readonly password: string;
}
