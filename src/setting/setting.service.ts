// jobs.service.ts
import { Injectable, NotFoundException,HttpException,HttpStatus } from '@nestjs/common';
import { CreateTemplateDto,UpdateTemplateDto } from './setting.dto';
import { DbService } from "../db/db.service";
import { UtilService } from "../util/util.service";
@Injectable()
export class SetingService {
  constructor(
    public dbService: DbService,
    public utilService: UtilService,
  ) {
  }

async createTemplate(dto: CreateTemplateDto) {
    try {
      // Prepare the data for insertion
      const setData = [
        { set: 'template_name', value: String(dto.template_name) },
        { set: 'template_type', value: String(dto.template_type) },
        { set: 'subject', value: dto.subject ? String(dto.subject) : null },
        { set: 'body', value: dto.body ? String(dto.body) : null },
      ];

      // Insert the template into the "templates" table
      const insertedTemplate = await this.dbService.insertData('templates', setData);

      if (!insertedTemplate?.id) {
        throw new Error('Failed to retrieve template ID after insertion.');
      }

      return this.utilService.successResponse(
        insertedTemplate,
        'Template created successfully.'
      );
    } catch (error) {
      console.error('Create Template Error:', error);
      throw new HttpException(
        `Failed to create template: ${error?.message || 'Unknown error'}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  
    async getAllTemplates() {
        const query = `
SELECT * FROM  
templates order by 
   id DESC;
`;
        const result = await this.dbService.execute(query);
        return this.utilService.successResponse(result, "Templates list retrieved successfully.");
    }


     async getTemplateById(id: number) {
    const query = `SELECT * FROM templates WHERE id = ${id}`;
    const result = await this.dbService.execute(query);
    
    if (!result.length) {
      throw new NotFoundException(`Templates with ID ${id} not found`);
    }
    return this.utilService.successResponse(result, "templates  retrieved successfully.");
  }

  async updateTemplate(id: number, dto: UpdateTemplateDto) {
    try {
      // Convert DTO to key=value pairs for update
      // const set = Object.entries(dto).map(([key, value]) => `${key}='${value}'`);

      const set = Object.entries(dto).map(([key, value]) => {
        // Default handling (wrap in quotes)
        return `${key}='${value}'`;
      });
      const where = [`id=${id}`];
      const updateResult = await this.dbService.updateData('templates', set, where);
      if (updateResult.affectedRows === 0) {
        return this.utilService.failResponse('templates not found or no changes made.');
      }
      return this.utilService.successResponse(updateResult, 'templates updated successfully.');
    } catch (error) {
      console.error('Error updating templates:', error);
      return this.utilService.failResponse('Failed to update templates.');
    }
  }



    async deleteTemplateById(id: number) {
    try {
      const query = `DELETE FROM "templates" WHERE id='${id}' RETURNING *;`;
      const result = await this.dbService.execute(query);
      if (result.length === 0) {
        return this.utilService.failResponse(null, "Templates not found or already deleted.");
      }
      return this.utilService.successResponse(result[0], "Templates deleted successfully.");

    }
    catch (error) {

      console.error('Delete templates Error:', error);
      throw new Error(error);
    }
  }

}



  
//   async getAllTemplates() {
// //     const query = `SELECT DISTINCT jobs.*
// // FROM jobs
// // LEFT JOIN candidates ON candidates.job_id = jobs.id
// // ORDER BY jobs.id DESC;`;
// //     const jobs = await this.dbService.execute(query);

//   const query = `
//     SELECT DISTINCT jobs.*
//     FROM jobs
//     LEFT JOIN candidate_job_applications ON candidate_job_applications.job_id = jobs.id
//     ORDER BY jobs.id DESC;
//   `;
//   const jobs = await this.dbService.execute(query);
//       // 2. Get count of jobs grouped by status
//   const countQuery = `
//     SELECT status, COUNT(*) AS count
//     FROM jobs
//     GROUP BY status;
//   `;
//   const countResult = await this.dbService.execute(countQuery);
//   // 3. Map result into a key-value object (e.g. { Draft: 4, Open: 10, ... })
//   const statusCounts: Record<string, number> = {
//     Draft: 0,
//     Open: 0,
//     Paused: 0,
//     Closed: 0,
//     Archived: 0,
//   };
//    countResult.forEach((row) => {
//     statusCounts[row.status] = Number(row.count);
//   });
//    const jobsWithIndex = jobs.map((job) => ({
//   ...job,
//   index: statusCounts, // whole statusCounts object
// }));

 
//     return this.utilService.successResponse(jobsWithIndex, "Jobs list retrieved successfully.");
//   }

//   async getJobById(id: number) {
//     const query = `SELECT * FROM jobs WHERE id = ${id}`;
//     const result = await this.dbService.execute(query);
    
//     if (!result.length) {
//       throw new NotFoundException(`Job with ID ${id} not found`);
//     }
//     return this.utilService.successResponse(result, "Jobs  retrieved successfully.");
//   }

//   async updateJob(id: number, dto: UpdateJobDto) {
//     try {
//       // Convert DTO to key=value pairs for update
//       // const set = Object.entries(dto).map(([key, value]) => `${key}='${value}'`);

//       const set = Object.entries(dto).map(([key, value]) => {
// if (key === 'office_location_additional' || key === 'keywords') {
//   return `${key}=${(Array.isArray(value) && value.length === 0) ? "'{}'" : JSON.stringify(value)}`;
// }
//         if (key === 'office_on_careers_page') {
//           return `${key}=${value === 'true' || value === true}`;
//         }
//         // Default handling (wrap in quotes)
//         return `${key}='${value}'`;
//       });
//       const where = [`id=${id}`];
//       const updateResult = await this.dbService.updateData('jobs', set, where);
//       if (updateResult.affectedRows === 0) {
//         return this.utilService.failResponse('Job not found or no changes made.');
//       }
//       return this.utilService.successResponse(updateResult, 'Job updated successfully.');
//     } catch (error) {
//       console.error('Error updating job:', error);
//       return this.utilService.failResponse('Failed to update job.');
//     }
//   }
//   async deleteJobById(id: number) {
//     try {
//       const query = `DELETE FROM "jobs" WHERE id='${id}' RETURNING *;`;
//       const result = await this.dbService.execute(query);
//       if (result.length === 0) {
//         return this.utilService.failResponse(null, "User not found or already deleted.");
//       }
//       return this.utilService.successResponse(result[0], "User deleted successfully.");

//     }
//     catch (error) {

//       console.error('Delete jobs Error:', error);
//       throw new Error(error);
//     }
//   }

//   async getTemplateById(jobId: number) {
// const query = `
// SELECT 
//   c.*,
//   COALESCE(
//     json_agg(
//       DISTINCT jsonb_build_object(
//         'job_id', cj.job_id,
//         'job_title', j.job_title,
//         'status', cj.status,
//         'recruiter_status', cj.recruiter_status,
//         'hmapproval', cj.hmapproval
//       )
//     ) FILTER (WHERE cj.job_id IS NOT NULL),
//     '[]'
//   ) AS jobs_assigned
// FROM 
//   candidates c
// LEFT JOIN 
//   candidate_job_applications cj ON cj.candidate_id = c.id
// LEFT JOIN 
//   jobs j ON j.id = cj.job_id
// where   j.id = ${jobId}
// GROUP BY 
//   c.id
// ORDER BY 
//   c.id DESC;
// `;

//     const result = await this.dbService.execute(query);
//    return this.utilService.successResponse(
//     result,
//     result.length
//       ? "Candidates with job details retrieved successfully."
//       : "No candidates found for this job."
//   );
//   }

 
  

 
