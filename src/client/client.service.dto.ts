// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsArray, IsInt, IsString, IsNotEmpty,IsEmail } from 'class-validator';

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

export class HireTalentDto {
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;
  company:string;

  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  phone: string;
 
  @IsString()
  @IsNotEmpty({ message: 'Role to hire is required' })
  role: string;

  @IsString()
  @IsNotEmpty({ message: 'Message is required' })
  message: string;
}