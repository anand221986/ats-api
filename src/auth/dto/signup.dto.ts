import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
export class SignUpDto {
  email: string;
  password: string;
  name: string;
  phone_number: string; // Must be string to handle + and international format
}

export class SignInDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}