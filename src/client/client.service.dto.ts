// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
}

export class UpdateClientDto extends CreateClientDto {}

// export class CreateClientFormDto {
//     @ApiProperty({ description: 'Admin email', example: 'admin@example.com' })
//     email: string;

//     @ApiProperty({ description: 'Admin password', example: 'adminpassword123' })
//     password: string;
// }

