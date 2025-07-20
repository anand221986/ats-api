import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: 'User email address', example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Verification code sent to email', example: '123456' })
  @IsString()
  @IsNotEmpty()
  verificationCode: string;

  @ApiProperty({ description: 'New password', example: 'NewPassword123!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
} 