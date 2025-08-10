// jobs.service.ts
import { Injectable, NotFoundException,HttpException,HttpStatus } from '@nestjs/common';
import { CreateJobDto, UpdateJobDto } from './jobs.dto';
import { DbService } from "../db/db.service";
import { UtilService } from "../util/util.service";
import { LinkedinService } from "../linkedin/linkedin.service";
import * as path from 'path';
import { spawn } from 'child_process';

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
        // { set: 'notice_period', value: String(dto.notice_period) },
      ];

      // Step 2: Insert the job
      const insertedJob = await this.dbService.insertData('jobs', setData)  ;
      console.log(insertedJob,'return result of table ')
      const jobId = insertedJob.id;

      if (!jobId) {
        throw new Error('Failed to retrieve job ID after insertion.');
      }

      // Step 3: Generate and update job_code
      const jobCode = `JOBS-${jobId}`;
      const jobStatus = `Open`;
      await this.dbService.updateData(
        'jobs',
        [`job_code = '${jobCode}'`, `status = '${jobStatus}'`],
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
//     const query = `SELECT DISTINCT jobs.*
// FROM jobs
// LEFT JOIN candidates ON candidates.job_id = jobs.id
// ORDER BY jobs.id DESC;`;
//     const jobs = await this.dbService.execute(query);

  const query = `
    SELECT DISTINCT jobs.*
    FROM jobs
    LEFT JOIN candidate_job_applications ON candidate_job_applications.job_id = jobs.id
    ORDER BY jobs.id DESC;
  `;
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
  COALESCE(
    json_agg(
      DISTINCT jsonb_build_object(
        'job_id', cj.job_id,
        'job_title', j.job_title,
        'status', cj.status,
        'recruiter_status', cj.recruiter_status,
        'hmapproval', cj.hmapproval
      )
    ) FILTER (WHERE cj.job_id IS NOT NULL),
    '[]'
  ) AS jobs_assigned
FROM 
  candidates c
LEFT JOIN 
  candidate_job_applications cj ON cj.candidate_id = c.id
LEFT JOIN 
  jobs j ON j.id = cj.job_id
GROUP BY 
  cj.job_id
ORDER BY 
  c.id DESC;
`;

    const result = await this.dbService.execute(query);
   return this.utilService.successResponse(
    result,
    result.length
      ? "Candidates with job details retrieved successfully."
      : "No candidates found for this job."
  );
  }

async runPythonScriptWithSpawn(pdfPath: string): Promise<any> {
  const pythonPath = path.resolve(__dirname, '../../../python/venv/bin/python3');
  const scriptPath = path.resolve(__dirname, '../../../python/jd_parser_entry.py');

  return new Promise((resolve, reject) => {
    try {
      const process = spawn(pythonPath, [scriptPath, pdfPath]);

      let output = '';
      let error = '';

      process.stdout.on('data', (data) => {
        const chunk = data.toString();
        output += chunk;
        console.log('Python chunk:', chunk); // Real-time logging
      });

      process.stderr.on('data', (data) => {
        error += data.toString();
        console.error('Python error:', data.toString());
      });

      process.on('error', (err) => {
        return reject(new Error(`Failed to start Python script: ${err.message}`));
      });

      process.on('close', (code) => {
        console.log('Final output:', output); // Full result after script finishes
        if (code !== 0) {
          return reject(new Error(`Python script exited with code ${code}: ${error}`));
        }

        try {
          console.log(output,'debug before output ')
          const parsed = JSON.parse(output);
          return resolve(parsed);
        } catch (e) {
          console.warn('Warning: Could not parse JSON. Returning raw output.');
          return resolve(output);
        }
      });

    } catch (err: any) {
      return reject(new Error(`Unexpected error running Python script: ${err.message}`));
    }
  });
}


      async insertExtractedData(extractedData, resumefilename) {
    try {
      console.log(extractedData, 'extractedData')
      let query = "SELECT  * FROM candidates WHERE email='" + extractedData.email + "'";
      const existingCandidate = await this.dbService.execute(query);
      if (Array.isArray(existingCandidate) && existingCandidate.length > 0) {
        return this.utilService.failResponse(
          `Candidate with email "${extractedData.email}" already exists.`
        );
      }

      let first_name = '';
      let last_name = '';
      if (extractedData.name) {
        const [first, ...lastParts] = extractedData.name.split(" ");
        first_name = first;
        last_name = lastParts.join(" ");
      }

      const setData = [
        { set: 'first_name', value: String(first_name) },
        { set: 'last_name', value: String(last_name) },
        { set: 'email', value: String(extractedData.email) },
        { set: 'phone', value: String(extractedData.phoneNumber ?? '') },
        { set: 'education', value: JSON.stringify(extractedData.education ?? []) },
        { set: 'experience', value: JSON.stringify(extractedData.experience ?? []) },
        { set: 'skill', value: extractedData.skillset ?? [] },
        { set: 'linkedinprofile', value: extractedData.linkedinProfile ?? '' },
        { set: 'address', value: JSON.stringify(extractedData.location ?? []) },
        { set: 'institutiontier', value: extractedData.institutionTier ?? [] },
        { set: 'companytier', value: extractedData.companyTier ?? [] },
        { set: 'resume_url', value: resumefilename }
      ];
      const candidateInsertion = await this.dbService.insertData('candidates', setData);
      const candidateId = candidateInsertion.insertId;
         const set = [`is_current=false`];
      const where = [`id ='${candidateId}'`];
      await this.dbService.updateData(
        'candidate_resumes',
        set,
        where
      );
      await this.dbService.insertData('candidate_resumes', [
        { set: 'candidate_id', value: candidateId },
        { set: 'resume_url', value: resumefilename },
        { set: 'uploaded_by', value: 'Admin' },
        { set: 'is_current', value: true }
      ]);
   
      return this.utilService.successResponse(candidateInsertion, 'Candidate created successfully.');
    } catch (error) {
      console.error('Create candidate Error:', error);
      throw new Error('Failed to create candidate. Please ensure all fields are valid and meet constraints.');
    }
  }
  


}
