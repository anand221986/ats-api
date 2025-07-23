import { IsOptional, IsNumberString } from 'class-validator';

export class GetResumesDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}