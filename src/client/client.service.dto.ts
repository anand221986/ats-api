// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsArray, IsInt, IsString, IsNotEmpty } from 'class-validator';

export class CreateClientDto {
  name: string;
  website: string;
  careersPage: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  linkedin: string;
  phone: string;
  tags: string[];
  industry: string;
  size: string;
  currency: string;
  revenue: string;
  email: string;
  contactPerson: string;
  agency_id:number;
}

export class UpdateClientDto extends CreateClientDto { }
export class CreateClientCandidatePitchDto {
  @IsInt()
  client_id: number;

  @IsArray()
  candidate_ids: number[];

  @IsString()
  @IsNotEmpty()
  message: string;
}