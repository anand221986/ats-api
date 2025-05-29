// jobs.service.ts
import { Injectable,NotFoundException } from '@nestjs/common';
import { CreateJobDto, UpdateJobDto } from './jobs.dto';
import { DbService } from "../db/db.service";
import { UtilService } from "../util/util.service";

@Injectable()
export class JobsService {
  private jobs: any[] = [];
    constructor(
      public dbService: DbService,
    public utilService: UtilService,
    ) {
    }

 async createJob(dto: CreateJobDto) {
  try {
    const setData = [
      { set: 'job_title', value: String(dto.jobTitle) },
      { set: 'job_code', value: String(dto.jobCode) },
      { set: 'department', value: String(dto.department) },
      { set: 'workplace', value: String(dto.workplace) },
      { set: 'office_primary_location', value: String(dto.officeLocation.primary) },
      { set: 'office_on_careers_page', value: String(dto.officeLocation.onCareersPage) },
      {
        set: 'office_location_additional',
        value: dto.officeLocation.additional?.length
          ? `{${dto.officeLocation.additional.join(',')}}`
          : '{}',
      },
      { set: 'description_about', value: String(dto.description.about) },
      { set: 'description_requirements', value: String(dto.description.requirements) },
      { set: 'description_benefits', value: String(dto.description.benefits) },
      { set: 'company_industry', value: String(dto.companyDetails.industry) },
      { set: 'company_job_function', value: String(dto.companyDetails.jobFunction) },
      { set: 'employment_type', value: String(dto.employmentDetails.employmentType) },
      { set: 'experience', value: String(dto.employmentDetails.experience) },
      { set: 'education', value: String(dto.employmentDetails.education) },
      {
        set: 'keywords',
        value: dto.employmentDetails.keywords?.length
          ? `{${dto.employmentDetails.keywords.join(',')}}`
          : '{}',
      },
      { set: 'salary_from', value: String(dto.salary.from) },
      { set: 'salary_to', value: String(dto.salary.to) },
      { set: 'salary_currency', value: String(dto.salary.currency) },
    ];

    const insertion = await this.dbService.insertData('jobs', setData);
    return this.utilService.successResponse(insertion, 'Job created successfully.');
  } catch (error) {
    console.error('Create Job Error:', error);
    throw new Error('Failed to create job. Please ensure all fields are valid and meet constraints.');
  }
}



  async getAllJobs() 
  {
  const query = `SELECT * FROM "jobs" ORDER BY id ASC;`;
  const result = await this.dbService.execute(query);
   return this.utilService.successResponse(result, "Jobs list retrieved successfully.");
  }

async getJobById(id: number){
  const query = `SELECT * FROM jobs WHERE id = ${id}`;
  const result = await this.dbService.execute(query);
  if (!result.length) {
    throw new NotFoundException(`Job with ID ${id} not found`);
  }
  return this.utilService.successResponse(result, "Jobs  retrieved successfully.");
}

  updateJob(id: number, dto: UpdateJobDto) {
    const index = this.jobs.findIndex((job) => job.id === id);
    if (index !== -1) {
      this.jobs[index] = { ...this.jobs[index], ...dto };
      return this.jobs[index];
    }
    return null;
  }

  deleteJob(id: number) {
    const index = this.jobs.findIndex((job) => job.id === id);
    if (index !== -1) {
      const removed = this.jobs.splice(index, 1);
      return removed[0];
    }
    return null;
  }
}
