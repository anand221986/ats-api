// jobs.dto.ts
import { IsString, IsEnum, IsOptional, IsBoolean, IsArray, IsNumber, ValidateNested, MinLength,IsInt,Min } from 'class-validator';
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
 office_primary_location:string;
 office_on_careers_page:string

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
  company: string;
  about_company:string;
  office_primary_location:string;
  office_on_careers_page:string;
  description_about:string;
  description_requirements: string;
  description_benefits: string;
  company_industry: string;
  company_job_function: string;
  employment_type: string;
  experience: string;
  education: string;
 salary_from: string;
 salary_to: string;
 salary_currency: string;
 keywords:string[];
 job_title:string;
 job_code:string;
insertId: number;
id: number;
 affectedRows?: number;
 @IsOptional() // if it's not a required field
  @IsInt()
  @Min(0) // ensures no negative values
  notice_period?: number;

}

export class UpdateJobDto extends CreateJobDto {}
