import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class RecoverPasswordDto {
  @IsNotEmpty()
  readonly tokenValue: string;

  @IsStrongPassword()
  readonly newPassword: string;
}
