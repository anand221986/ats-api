import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString,IsOptional } from 'class-validator';

export class CreateAgencyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

}
export class UpdateAgencyDto {
  @IsString()
  @IsOptional()
  name?: string;
}