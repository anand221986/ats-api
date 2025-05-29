// jobs.dto.ts
import { IsString, IsEnum, IsOptional, IsBoolean, IsArray, IsNumber, ValidateNested, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export enum WorkplaceEnum {
  OnSite = 'On-site',
  Hybrid = 'Hybrid',
  Remote = 'Remote',
}

export class OfficeLocationDto {
  @IsString()
  primary: string;

  @IsBoolean()
  onCareersPage: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  additional?: string[];
}

export class DescriptionDto {
  @IsString()
  @MinLength(700)
  about: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  @IsString()
  benefits?: string;
}

export class CompanyDetailsDto {
  @IsString()
  industry: string;

  @IsString()
  jobFunction: string;
}

export class EmploymentDetailsDto {
  @IsEnum(['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'])
  employmentType: string;

  @IsEnum(['Entry level', 'Mid level', 'Senior level', 'Director', 'Executive'])
  experience: string;

  @IsEnum(['High School', 'Associate', 'Bachelor', 'Master', 'Doctorate'])
  education: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];
}

export class SalaryDto {
  @IsNumber()
  from: number;

  @IsNumber()
  to: number;

  @IsString()
  currency: string;
}

export class CreateJobDto {
  @IsString()
  jobTitle: string;

  @IsOptional()
  @IsString()
  jobCode?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsEnum(WorkplaceEnum)
  workplace: WorkplaceEnum;

  @ValidateNested()
  @Type(() => OfficeLocationDto)
  officeLocation: OfficeLocationDto;

  @ValidateNested()
  @Type(() => DescriptionDto)
  description: DescriptionDto;

  @ValidateNested()
  @Type(() => CompanyDetailsDto)
  companyDetails: CompanyDetailsDto;

  @ValidateNested()
  @Type(() => EmploymentDetailsDto)
  employmentDetails: EmploymentDetailsDto;

  @ValidateNested()
  @Type(() => SalaryDto)
  salary: SalaryDto;
}

export class UpdateJobDto extends CreateJobDto {}
