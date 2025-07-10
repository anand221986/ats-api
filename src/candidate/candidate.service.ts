// jobs.service.ts
import { Injectable,NotFoundException } from '@nestjs/common';
import { CreateCandidateDto,UpdateCandidateDto } from './create-candidate.dto';
import { DbService } from "../db/db.service";
import { UtilService } from "../util/util.service";
import { PythonShell } from 'python-shell';
import * as fs from 'fs';
import * as pdfParse from 'pdf-parse';
import * as path from 'path';
import { spawn } from 'child_process';
@Injectable()
export class CandidateService {
  private jobs: any[] = [];
    constructor(
      public dbService: DbService,
    public utilService: UtilService,
    ) {
    }

 async createCandidate(dto: CreateCandidateDto) {
  try {
const setData= [
  { set: 'first_name', value: String(dto.first_name) },
  { set: 'last_name', value: String(dto.last_name) },
  { set: 'email', value: String(dto.email) },
  { set: 'headline', value: String(dto.headline ?? '') },
  { set: 'phone', value: String(dto.phone ?? '') },
  { set: 'address', value: String(dto.address ?? '') },
  { set: 'photo_url', value: String(dto.photo_url ?? '') },
  { set: 'education', value: String(dto.education ?? '') },
  { set: 'experience', value: String(dto.experience ?? '') },
  { set: 'summary', value: String(dto.summary ?? '') },
  { set: 'resume_url', value: String(dto.resume_url ?? '') },
  { set: 'cover_letter', value: String(dto.cover_letter ?? '') },
  { set: 'current_company', value: String(dto.current_company ?? '') },
  { set: 'current_ctc', value: dto.current_ctc !== null && dto.current_ctc !== undefined ? String(dto.current_ctc) : '' },
  { set: 'expected_ctc', value: dto.expected_ctc !== null && dto.expected_ctc !== undefined ? String(dto.expected_ctc) : '' },
  { set: 'skill', value: Array.isArray(dto.skill) ? `{${dto.skill.join(',')}}` : '{}' }, // PostgreSQL array format
  { set: 'college', value: String(dto.college ?? '') },
  { set: 'degree', value: String(dto.degree ?? '') },
  { set: 'rating', value: dto.rating !== null && dto.rating !== undefined ? String(dto.rating) : '' },
];
    const insertion = await this.dbService.insertData('candidates', setData);
    return this.utilService.successResponse(insertion, 'Candidate created successfully.');
  } catch (error) {
    console.error('Create candidate Error:', error);
    throw new Error('Failed to create candidate. Please ensure all fields are valid and meet constraints.');
  }
}

  async getAllCandidates() 
  {
const query = `
    SELECT 
      c.*, 
      j.id AS job_id, 
      j.job_title 
    FROM 
      candidates c
    LEFT JOIN 
      jobs j ON c.job_id = j.id
    ORDER BY 
      c.id DESC;
  `;
  const result = await this.dbService.execute(query);
  return this.utilService.successResponse(result, "Candidates list retrieved successfully.");
  }

  async getCandidateId(id: number){
  const query = `SELECT * FROM candidates WHERE id = ${id}`;
  const result = await this.dbService.execute(query);
  if (!result.length) {
    throw new NotFoundException(`candidates with ID ${id} not found`);
  }
  return this.utilService.successResponse(result, "Candidates  retrieved successfully.");
}

  async updateCandidate(id: number, dto: UpdateCandidateDto) {
      try {
            // Convert DTO to key=value pairs for update
            const set = Object.entries(dto).map(([key, value]) => `${key}='${value}'`);
            const where = [`id=${id}`];
            const updateResult = await this.dbService.updateData('candidates', set, where);
            if (updateResult.affectedRows === 0) {
                return this.utilService.failResponse('candidates not found or no changes made.');
            }
            return this.utilService.successResponse(updateResult, 'candidates updated successfully.');
        } catch (error) {
            console.error('Error updating candidates:', error);
            return this.utilService.failResponse('Failed to update candidates.');
        }
  }

  async deleteCandidate(id: number) {
    const index = this.jobs.findIndex((job) => job.id === id);
    if (index !== -1) {
      const removed = this.jobs.splice(index, 1);
      return removed[0];
    }
    return null;
  }

  async createCandidatesBulk(dtos: CreateCandidateDto[]) {
  try {
    const allInsertions = [];

   for (const dto of dtos) {
    const setData = [
  { set: 'first_name', value: String(dto.first_name) },
  { set: 'last_name', value: String(dto.last_name) },
  { set: 'email', value: String(dto.email) },
  { set: 'headline', value: String(dto.headline ?? '') },
  { set: 'phone', value: String(dto.phone ?? '') },
  { set: 'address', value: String(dto.address ?? '') },
  { set: 'photo_url', value: String(dto.photo_url ?? '') },
  { set: 'education', value: String(dto.education ?? '') },
  { set: 'experience', value: String(dto.experience ?? '') },
  { set: 'summary', value: String(dto.summary ?? '') },
  { set: 'resume_url', value: String(dto.resume_url ?? '') },
  { set: 'cover_letter', value: String(dto.cover_letter ?? '') },
  { set: 'current_company', value: String(dto.current_company ?? '') },
  { set: 'current_ctc', value: dto.current_ctc !== null && dto.current_ctc !== undefined ? String(dto.current_ctc) : '' },
  { set: 'expected_ctc', value: dto.expected_ctc !== null && dto.expected_ctc !== undefined ? String(dto.expected_ctc) : '' },
  { set: 'skill', value: Array.isArray(dto.skill) ? `{${dto.skill.join(',')}}` : '{}' }, // PostgreSQL array format
  { set: 'college', value: String(dto.college ?? '') },
  { set: 'degree', value: String(dto.degree ?? '') },
  { set: 'rating', value: dto.rating !== null && dto.rating !== undefined ? String(dto.rating) : '' },
];
   const result = await this.dbService.insertData('candidates', setData);
 
    }
 return this.utilService.successResponse(allInsertions, 'Bulk Candidates created successfully.');
  } catch (error) {
    console.error('Bulk create candidate error:', error);
    throw new Error('Failed to create candidates.');
  }
}
async assignCandidatesToJobs(jobIds: number[], candidateIds: number[]) {
  try {
    if (!jobIds?.length || !candidateIds?.length) {
      return this.utilService.failResponse('Both jobIds and candidateIds must be provided.');
    }

    // 1. Validate jobIds
    const jobIdList = jobIds.join(',');
    const jobCheckQuery = `SELECT * FROM jobs WHERE id IN (${jobIdList})`;

    console.log(jobCheckQuery,'jobCheckQuery')
    const existingJobs = await this.dbService.execute(jobCheckQuery);
    console.log(existingJobs,'existingjob')
    const existingJobIds = existingJobs.map((job: any) => job.id);
    const missingJobIds = jobIds.filter(id => !existingJobIds.includes(id));

    if (missingJobIds.length > 0) {
      return this.utilService.failResponse(`Job ID(s) not found: ${missingJobIds.join(', ')}`);
    }

    // 2. Validate candidateIds
    const candidateIdList = candidateIds.join(',');
    const candidateCheckQuery = `SELECT id FROM candidates WHERE id IN (${candidateIdList})`;
    const existingCandidates = await this.dbService.execute(candidateCheckQuery);
    const existingCandidateIds = existingCandidates.map((c: any) => c.id);
    const missingCandidateIds = candidateIds.filter(id => !existingCandidateIds.includes(id));

    if (missingCandidateIds.length > 0) {
      return this.utilService.failResponse(`Candidate ID(s) not found: ${missingCandidateIds.join(', ')}`);
    }

    // 3. Proceed with update
    if (jobIds.length === 1) {
      const jobId = jobIds[0];
      const set = [`job_id=${jobId}`];
      const where = [`id IN (${candidateIdList})`];
      const result = await this.dbService.updateData('candidates', set, where);
      return this.utilService.successResponse('Candidates assigned to job successfully.');
    }

    // 4. Assign multiple jobs to multiple candidates
    const updates: Promise<any>[] = [];
    for (const candidateId of candidateIds) {
      for (const jobId of jobIds) {
        const set = [`job_id=${jobId}`];
        const where = [`id=${candidateId}`];
        updates.push(this.dbService.updateData('candidates', set, where));
      }
    }
    const results = await Promise.all(updates);
    return this.utilService.successResponse('Candidates assigned to jobs successfully.');
  } catch (error) {
    console.error('Error assigning candidates:', error);
    return this.utilService.failResponse('Failed to assign candidates.');
  }
}

async processPdf(filePath: string): Promise<any> {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      // Example response: total pages and text content
      return {
        filePath,
        numPages: pdfData.numpages,
        info: pdfData.info,
        textSnippet: pdfData.text.substring(0, 300), // First 300 chars
      };
    } catch (err) {
      throw new Error(`Error reading PDF: ${err.message}`);
    }
  }

 async runPythonScriptWithSpawn(pdfPath: string): Promise<any> {
  const pythonPath = path.resolve(__dirname, '../../../python/venv/bin/python3');
  const scriptPath = path.resolve(__dirname, '../../../python/main.py');
  return new Promise((resolve, reject) => {
    const process = spawn(pythonPath, [scriptPath, pdfPath]);
    let output = '';
    let error = '';
    process.stdout.on('data', (data) => {
      output += data.toString();
    });
    process.stderr.on('data', (data) => {
      error += data.toString();
    });
    process.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Python script exited with code ${code}: ${error}`));
      }
      try {
        const parsed = JSON.parse(output);
        resolve(parsed);
      } catch {
        resolve(output); // fallback if not JSON
      }
    });
  });
}



async insertExtractedData(extractedData) {
  try {
    console.log(extractedData,'extractedData')
    const [first_name, ...lastNameParts] = extractedData.name.split(" ");
  const last_name = lastNameParts.join(" ");
const setData= [
  { set: 'first_name', value: String(first_name) },
  { set: 'last_name', value: String(last_name) },
  { set: 'email', value: String(extractedData.email) },
  { set: 'headline', value: String(extractedData.headline ?? '') },
  { set: 'phone', value: String(extractedData.phoneNumbephone ?? '') },
  { set: 'address', value: String(extractedData.address ?? '') },
  { set: 'photo_url', value: String(extractedData.photo_url ?? '') },
  { set: 'education', value: String(extractedData.education ?? '') },
  { set: 'experience', value: String(extractedData.experience ?? '') },
  { set: 'summary', value: String(extractedData.summary ?? '') },
  { set: 'resume_url', value: String(extractedData.resume_url ?? '') },
  { set: 'cover_letter', value: String(extractedData.cover_letter ?? '') },
  { set: 'current_company', value: String(extractedData.current_company ?? '') },
  { set: 'current_ctc', value: extractedData.current_ctc !== null && extractedData.current_ctc !== undefined ? String(extractedData.current_ctc) : '' },
  { set: 'expected_ctc', value: extractedData.expected_ctc !== null && extractedData.expected_ctc !== undefined ? String(extractedData.expected_ctc) : '' },
  { set: 'skill', value: Array.isArray(extractedData.skills) ? `{${extractedData.skills.join(',')}}` : '{}' }, // PostgreSQL array format
  { set: 'college', value: String(extractedData.college ?? '') },
  { set: 'degree', value: String(extractedData.degree ?? '') },
  { set: 'rating', value: extractedData.rating !== null && extractedData.rating !== undefined ? String(extractedData.rating) : '' },
];
    const insertion = await this.dbService.insertData('candidates', setData);
    return this.utilService.successResponse(insertion, 'Candidate created successfully.');
  } catch (error) {
    console.error('Create candidate Error:', error);
    throw new Error('Failed to create candidate. Please ensure all fields are valid and meet constraints.');
  }
}


}
