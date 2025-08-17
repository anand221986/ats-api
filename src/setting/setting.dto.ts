import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTemplateDto {
  @IsString()
  @IsNotEmpty()
  template_name: string;

  @IsString()
  @IsNotEmpty()
  template_type: string;

  @IsString()
  @IsOptional()
  subject?: string;

  @IsString()
  @IsOptional()
  body?: string;
}


export class UpdateTemplateDto extends CreateTemplateDto {}