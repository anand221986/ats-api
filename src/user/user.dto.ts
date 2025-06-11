import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCustomerDto {
    @ApiProperty({ description: 'First name of the customer', type: String })
    first_name: string;
  
    @ApiProperty({ description: 'Last name of the customer', type: String })
    last_name: string;
  
    @ApiProperty({ description: 'Email of the customer', type: String, format: 'email' })
    email: string;
  
    @ApiProperty({ description: 'Phone number of the customer', type: String })
    phone: string;
  
    @ApiPropertyOptional({ description: 'Status of the customer', type: Number, enum: [0, 1], example: 1 })
    status?: string;
  
    @ApiProperty({ description: 'ID of the customer to update', type: String })
    id: string;
  }

export class CreateCustomerDto {
  @ApiProperty({ description: 'First name of the customer', type: String })
  first_name: string;

  @ApiProperty({ description: 'Last name of the customer', type: String })
  last_name: string;

  @ApiProperty({ description: 'Email of the customer', type: String, format: 'email' })
  email: string;

  @ApiProperty({ description: 'Phone number of the customer', type: String })
  phone: string;

  @ApiProperty({ description: 'Password for the customer', type: String, required: false })
  password?: string;
}

export class UpdateUserTravellerDto {
  @ApiPropertyOptional({ description: 'The ID of the user associated with the traveller', example: '456' })
  user_id?: string;

  @ApiPropertyOptional({ description: 'Salutation for the traveller', example: 'Mr.' })
  salutation?: string;

  @ApiPropertyOptional({ description: 'First name of the traveller', example: 'John' })
  first_name?: string;

  @ApiPropertyOptional({ description: 'Last name of the traveller', example: 'Doe' })
  last_name?: string;

  @ApiPropertyOptional({ description: 'Type of traveller', example: 'Adult' })
  type?: string;

  @ApiPropertyOptional({ description: 'Passport insurance date', example: '2024-01-01', format: 'date' })
  passport_insurance_date?: string;

  @ApiPropertyOptional({ description: 'Passport expiration date', example: '2034-01-01', format: 'date' })
  passport_expired_date?: string;

  @ApiPropertyOptional({ description: 'Passport number of the traveller', example: 'A1234567' })
  passport_number?: string;

  @ApiPropertyOptional({ description: 'PAN number of the traveller', example: 'ABCDE1234F' })
  pan_number?: string;

  @ApiPropertyOptional({ description: 'Place where the passport was issued', example: 'New York' })
  place_of_inssurance?: string;

  @ApiPropertyOptional({ description: 'Date of birth of the traveller', example: '1990-05-15', format: 'date' })
  date_of_birth?: string;
}

export class AddUserTravellerDto {
  @ApiProperty({ description: 'The ID of the user associated with the traveller', example: '456' })
  user_id: string;

  @ApiProperty({ description: 'Salutation for the traveller', example: 'Mr.' })
  salutation: string;

  @ApiProperty({ description: 'First name of the traveller', example: 'John' })
  first_name: string;

  @ApiProperty({ description: 'Last name of the traveller', example: 'Doe' })
  last_name: string;

  @ApiProperty({ description: 'Type of traveller', example: 'Adult' })
  type: string;

  @ApiProperty({ description: 'Passport insurance date', example: '2024-01-01', format: 'date' })
  passport_insurance_date: string;

  @ApiProperty({ description: 'Passport expiration date', example: '2034-01-01', format: 'date' })
  passport_expired_date: string;

  @ApiProperty({ description: 'Passport number of the traveller', example: 'A1234567' })
  passport_number: string;

  @ApiProperty({ description: 'PAN number of the traveller', example: 'ABCDE1234F' })
  pan_number: string;

  @ApiProperty({ description: 'Place where the passport was issued', example: 'New York' })
  place_of_inssurance: string;

  @ApiProperty({ description: 'Date of birth of the traveller', example: '1990-05-15', format: 'date' })
  date_of_birth: string;
}

export class UpdateUserProfileDto {
  @ApiProperty({ description: 'First name of the user', example: 'John' })
  first_name: string;

  @ApiProperty({ description: 'Last name of the user', example: 'Doe' })
  last_name: string;

  @ApiProperty({ description: 'Birthday of the user', example: '1990-05-15', format: 'date' })
  birthday: string;

  @ApiProperty({ description: 'Gender of the user', example: 'male', enum: ['male', 'female', 'other'] })
  gender: string;

  @ApiProperty({ description: 'Marital status of the user', example: 'single', enum: ['single', 'married', 'divorced'] })
  marital_status: string;

  @ApiProperty({ description: 'Address of the user', example: '123 Main Street' })
  address: string;

  @ApiProperty({ description: 'Pin code of the user', example: '123456' })
  pin_code: string;

  @ApiProperty({ description: 'State of the user', example: 'California' })
  state: string;
}

export class RegisterDto {
  @ApiProperty({ description: 'First name of the user', example: 'John' })
  first_name: string;

  @ApiProperty({ description: 'Last name of the user', example: 'Doe' })
  last_name: string;

  @ApiProperty({ description: 'Email of the user', example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ description: 'Phone number of the user', example: '1234567890' })
  phone: string;
   @ApiProperty({ description: 'password of the user', example: '12345' })
  password: string;
}

export class LoginDto {
    @ApiProperty({ description: 'Email of the user', example: 'john.doe@example.com' })
    email: string;
  
    @ApiProperty({ description: 'Password of the user', example: 'password123' })
    password: string;

}

export class LoginAdminDto {
    @ApiProperty({ description: 'Admin email', example: 'admin@example.com' })
    email: string;

    @ApiProperty({ description: 'Admin password', example: 'adminpassword123' })
    password: string;
}

