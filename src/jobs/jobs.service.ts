// jobs.service.ts
import { Injectable, NotFoundException,HttpException,HttpStatus } from '@nestjs/common';
import { CreateJobDto, UpdateJobDto } from './jobs.dto';
import { DbService } from "../db/db.service";
import { UtilService } from "../util/util.service";
import { LinkedinService } from "../linkedin/linkedin.service";

@Injectable()
export class JobsService {
  private jobs: any[] = [];
  constructor(
    public dbService: DbService,
    public utilService: UtilService,
    public linkdinService: LinkedinService,
  ) {
  }

  async createJob(dto: CreateJobDto) {
    try {
      // Step 1: Prepare the data (excluding job_code initially)
      const setData = [
        { set: 'job_title', value: String(dto.job_title) },
        { set: 'department', value: String(dto.department) },
        { set: 'workplace', value: String(dto.workplace) },
        { set: 'office_primary_location', value: String(dto.office_primary_location) },
        { set: 'office_on_careers_page', value: String(dto.office_on_careers_page) },
        { set: 'description_about', value: String(dto.description_about) },
        { set: 'description_requirements', value: String(dto.description_requirements) },
        { set: 'description_benefits', value: String(dto.description_benefits) },
        { set: 'company_industry', value: String(dto.company_industry) },
        { set: 'company_job_function', value: String(dto.company_job_function) },
        { set: 'employment_type', value: String(dto.employment_type) },
        { set: 'experience', value: String(dto.experience) },
        { set: 'education', value: String(dto.education) },
        { set: 'company', value: String(dto.company) },
        { set: 'about_company', value: String(dto.about_company) },
        {
          set: 'keywords',
          value: dto.keywords?.length ? `{${dto.keywords.join(',')}}` : '{}',
        },
        { set: 'salary_from', value: String(dto.salary_from) },
        { set: 'salary_to', value: String(dto.salary_to) },
        { set: 'salary_currency', value: String(dto.salary_currency) },
        { set: 'notice_period', value: String(dto.salary_currency) },
      ];

      // Step 2: Insert the job
      const insertedJob = await this.dbService.insertData('jobs', setData);
      console.log(insertedJob,'return result of table ')
      const jobId = insertedJob?.insertId;

      if (!jobId) {
        throw new Error('Failed to retrieve job ID after insertion.');
      }

      // Step 3: Generate and update job_code
      const jobCode = `JOBS-${jobId}`;
      const jobStatus = `Open`;
      await this.dbService.updateData(
        'jobs',
        [`job_code = '${jobCode}'`, `job_status = '${jobStatus}'`],
        [`id = ${jobId}`]
      );

      // Step 4: Return response
      return this.utilService.successResponse(
        { ...insertedJob, job_code: jobCode },
        'Job created successfully.'
      );
    } catch (error) {
      console.error('Create Job Error:', error);
    throw new HttpException(
  `Failed to create job: ${error?.message || 'Unknown error'}`,
  HttpStatus.BAD_REQUEST
);
    }
  }




  async getAllJobs() {
    const query = `SELECT DISTINCT jobs.*
FROM jobs
LEFT JOIN candidates ON candidates.job_id = jobs.id
ORDER BY jobs.id DESC;`;
    const jobs = await this.dbService.execute(query);
      // 2. Get count of jobs grouped by status
  const countQuery = `
    SELECT status, COUNT(*) AS count
    FROM jobs
    GROUP BY status;
  `;
  const countResult = await this.dbService.execute(countQuery);
  // 3. Map result into a key-value object (e.g. { Draft: 4, Open: 10, ... })
  const statusCounts: Record<string, number> = {
    Draft: 0,
    Open: 0,
    Paused: 0,
    Closed: 0,
    Archived: 0,
  };
   countResult.forEach((row) => {
    statusCounts[row.status] = Number(row.count);
  });
   const jobsWithIndex = jobs.map((job) => ({
  ...job,
  index: statusCounts, // whole statusCounts object
}));

 
    return this.utilService.successResponse(jobsWithIndex, "Jobs list retrieved successfully.");
  }

  async getJobById(id: number) {
    const query = `SELECT * FROM jobs WHERE id = ${id}`;
    const result = await this.dbService.execute(query);
    
    if (!result.length) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    return this.utilService.successResponse(result, "Jobs  retrieved successfully.");
  }

  async updateJob(id: number, dto: UpdateJobDto) {
    try {
      // Convert DTO to key=value pairs for update
      const set = Object.entries(dto).map(([key, value]) => `${key}='${value}'`);
      const where = [`id=${id}`];
      const updateResult = await this.dbService.updateData('jobs', set, where);
      if (updateResult.affectedRows === 0) {
        return this.utilService.failResponse('Job not found or no changes made.');
      }
      return this.utilService.successResponse(updateResult, 'Job updated successfully.');
    } catch (error) {
      console.error('Error updating job:', error);
      return this.utilService.failResponse('Failed to update job.');
    }
  }
  async deleteJobById(id: number) {
    try {
      const query = `DELETE FROM "jobs" WHERE id='${id}' RETURNING *;`;
      const result = await this.dbService.execute(query);
      if (result.length === 0) {
        return this.utilService.failResponse(null, "User not found or already deleted.");
      }
      return this.utilService.successResponse(result[0], "User deleted successfully.");

    }
    catch (error) {

      console.error('Delete jobs Error:', error);
      throw new Error(error);
    }
  }

  async getAllApplicantsByJobId(jobId: number) {
    const query = `
    SELECT 
      c.*,
      j.job_title AS job_title,
      j.description_about AS job_description,
      j.office_primary_location AS job_location 
    FROM candidates c
    INNER JOIN jobs j ON c.job_id = j.id
    WHERE c.job_id = ${jobId}
    ORDER BY c.id DESC
  `;
    const result = await this.dbService.execute(query);
   return this.utilService.successResponse(
    result,
    result.length
      ? "Candidates with job details retrieved successfully."
      : "No candidates found for this job."
  );
  }


}
