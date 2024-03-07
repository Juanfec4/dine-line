import { IsNotEmpty } from 'class-validator';

export class VerifyDto {
  @IsNotEmpty()
  readonly tokenValue: string;
}
