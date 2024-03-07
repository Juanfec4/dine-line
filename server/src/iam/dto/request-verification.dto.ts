import { IsEmail } from 'class-validator';

export class RequestVerificationDto {
  @IsEmail()
  readonly email: string;
}
