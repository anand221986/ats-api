// jobs.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCandidateDto, UpdateCandidateDto, UpdateActionDto, CandidateNotesDto, updateCandidateNotesDto } from './create-candidate.dto';
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
      const duplicateCheckQuery = `
        SELECT * FROM candidates 
        WHERE LOWER(first_name) = LOWER('${dto.first_name}') 
        AND LOWER(last_name) = LOWER('${dto.last_name}') 
        AND LOWER(email) = LOWER('${dto.email}')
      `;
      const existingCandidate = await this.dbService.execute(duplicateCheckQuery);

      if (Array.isArray(existingCandidate) && existingCandidate.length > 0) {
        throw new Error('Name and email already exist in db table, please choose another one');
      }

      const emailCheckQuery = `SELECT * FROM candidates WHERE LOWER(email) = LOWER('${dto.email}')`;
      const existingEmail = await this.dbService.execute(emailCheckQuery);

      if (Array.isArray(existingEmail) && existingEmail.length > 0) {
        throw new Error('Email already exists in database, please use a different email address');
      }

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
        { set: 'skill', value: Array.isArray(dto.skill) ? `{${dto.skill.join(',')}}` : '{}' }, // PostgreSQL array format
        { set: 'college', value: String(dto.college ?? '') },
        { set: 'degree', value: String(dto.degree ?? '') },
      ];

      if (dto.current_ctc !== null && dto.current_ctc !== undefined) {
        setData.push({ set: 'current_ctc', value: String(dto.current_ctc) });
      }
      if (dto.expected_ctc !== null && dto.expected_ctc !== undefined) {
        setData.push({ set: 'expected_ctc', value: String(dto.expected_ctc) });
      }
      if (dto.rating !== null && dto.rating !== undefined) {
        setData.push({ set: 'rating', value: String(dto.rating) });
      }
      const insertion = await this.dbService.insertData('candidates', setData);
      return this.utilService.successResponse(insertion, 'Candidate created successfully.');
    } catch (error) {
      console.error('Create candidate Error:', error);
      throw error;
    }
  }

  async getAllCandidates() {
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

  async getCandidateId(id: number) {
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
          // { set: 'current_ctc', value: dto.current_ctc !== null && dto.current_ctc !== undefined ? String(dto.current_ctc) : '' },
          // { set: 'expected_ctc', value: dto.expected_ctc !== null && dto.expected_ctc !== undefined ? String(dto.expected_ctc) : '' },
          // { set: 'skill', value: Array.isArray(dto.skill) ? `{${dto.skill.join(',')}}` : '{}' }, // PostgreSQL array format
          // { set: 'college', value: String(dto.college ?? '') },
          // { set: 'degree', value: String(dto.degree ?? '') },
          // { set: 'rating', value: dto.rating !== null && dto.rating !== undefined ? String(dto.rating) : '' },
        ];
        let query = "SELECT  * FROM candidates WHERE email='" + dto.email + "'";
        const existingCandidate = await this.dbService.execute(query);
        if (Array.isArray(existingCandidate) && existingCandidate.length > 0) {
          return this.utilService.failResponse(
            `Candidate with email "${dto.email}" already exists.Please update sheet`
          );
        }
        console.log(setData)
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

      console.log(jobCheckQuery, 'jobCheckQuery')
      const existingJobs = await this.dbService.execute(jobCheckQuery);
      console.log(existingJobs, 'existingjob')
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
      //     extractedData= {
      //         "name": "Udayveer Singh",
      //         "phoneNumber": "93352 96725",
      //         "email": "veerukalpi2018@gmail.com",
      //         "linkedInProfile": null,
      //         "experience": [
      //             {
      //                 "title": "Software Engineer Intern",
      //                 "description": "Worked on projects involving Java, Python, React, SpringBoot, and MongoDB. Developed e-commerce website and a lost item finder app. Gained experience in web and mobile app development, database management, and version control."
      //             }
      //         ],
      //         "education": [
      //             {
      //                 "institution": "AXIS INSTITUTE OF TECHNOLOGY & MANAGEMENT",
      //                 "degree": "B.Tech in Information Technology",
      //                 "period": "July 2021 - July 2025",
      //                 "percentage": "68%"
      //             },
      //             {
      //                 "institution": "DR. AMBEDKAR INTERCOLLEGE ATA",
      //                 "degree": "PCM Intermediate",
      //                 "period": "July 2019 - July 2020",
      //                 "percentage": "68%"
      //             },
      //             {
      //                 "institution": "M.J.H INTERCOLLEGE ATA",
      //                 "degree": "High School",
      //                 "period": "July 2017 - July 2018",
      //                 "percentage": "85%"
      //             }
      //         ],
      //         "skills": [
      //             "Java",
      //             "Python",
      //             "JavaScript",
      //             "React",
      //             "Git",
      //             "VS Code",
      //             "MongoDb",
      //             "MySql"
      //         ],
      //         "projects": [
      //             {
      //                 "name": "Lostio User Friendly Application",
      //                 "description": "React-Native, SpringBoot, MongoDb. Simplifies finding lost items and their owners, enhancing user experience."
      //             },
      //             {
      //                 "name": "E-Commerce Website",
      //                 "description": "Responsive frontend developed with React.js, including product listings, reusable UI components, and modern design practices."
      //             }
      //         ],
      //         "certifications": [
      //             "Cybersecurity Virtual Internship - AICTE",
      //             "Cybersecurity Virtual Internship - AICTE",
      //             "DIT PLUS (Microsoft Office) - ICL Kalpi"
      //         ],
      //         "honorsAndAwards": [
      //             "Solved 200+ questions on LeetCode, HackerRank, and GeeksforGeeks."
      //         ],
      //         "overallScore": 75

      // }

      let query = "SELECT  * FROM candidates WHERE email='" + extractedData.email + "'";
      const existingCandidate = await this.dbService.execute(query);
      if (Array.isArray(existingCandidate) && existingCandidate.length > 0) {
        return this.utilService.failResponse(
          `Candidate with email "${extractedData.email}" already exists.`
        );
      }
      const [first_name, ...lastNameParts] = extractedData.name.split(" ");
      const last_name = lastNameParts.join(" ");
      const setData = [
        { set: 'first_name', value: String(first_name) },
        { set: 'last_name', value: String(last_name) },
        { set: 'email', value: String(extractedData.email) },
        { set: 'phone', value: String(extractedData.phoneNumber ?? '') },
        { set: 'address', value: String(extractedData.address ?? '') },
        { set: 'education', value: JSON.stringify(extractedData.education ?? []) },
        { set: 'experience', value: JSON.stringify(extractedData.experience ?? []) },
        { set: 'skill', value: extractedData.skills ?? [] }
      ];
      const insertion = await this.dbService.insertData('candidates', setData);
      return this.utilService.successResponse(insertion, 'Candidate created successfully.');
    } catch (error) {
      console.error('Create candidate Error:', error);
      throw new Error('Failed to create candidate. Please ensure all fields are valid and meet constraints.');
    }
  }

  async checkExistingCandidate(email) {
    let query = "SELECT  * FROM candidates WHERE email='" + email + "'";
    const existingCandidate = await this.dbService.execute(query);
    if (Array.isArray(existingCandidate) && existingCandidate.length > 0) {
      return this.utilService.failResponse(
        `Candidate with email "${email}" already exists.`
      );
    }
  }

  async importCandidate(dtos: CreateCandidateDto[]) {
    const results: { status: boolean; message: string; result?: any; error?: any }[] = [];

    for (const dto of dtos) {
      try {
        const skillValue = dto.skill ?? '';
        const skills = Array.isArray(skillValue)
          ? skillValue
          : typeof skillValue === 'string'
            ? skillValue.split(',').map(s => s.trim()).filter(Boolean)
            : [];

        const setData = [
          { set: 'first_name', value: String(dto.first_name ?? '') },
          { set: 'last_name', value: String(dto.last_name ?? '') },
          { set: 'email', value: String(dto.email ?? '') },
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
          { set: 'current_ctc', value: dto.current_ctc != null ? String(dto.current_ctc) : '' },
          { set: 'expected_ctc', value: dto.expected_ctc != null ? String(dto.expected_ctc) : '' },
          { set: 'skill', value: `{${skills.join(',')}}` },
          { set: 'college', value: String(dto.college ?? '') },
          { set: 'degree', value: String(dto.degree ?? '') },
          { set: 'rating', value: dto.rating != null ? String(dto.rating) : '' },
        ];

        const insertion = await this.dbService.insertData('candidates', setData);
        results.push({
          status: true,
          message: `Candidate ${dto.email ?? ''} inserted successfully.`,
          result: insertion,
        });
      } catch (error) {
        results.push({
          status: false,
          message: `Failed to insert candidate ${dto.email ?? ''}`,
          error: error.message,
        });
      }
    }

    return {
      status: true,
      message: 'Bulk operation completed',
      results,
    };
  }


  async bulkUpdateCandidates(
    ids: number[],
    updates: { field: string; action: string; value: any }[],
  ) {
    try {
      type BulkUpdateResult = {
        id: number;
        updated: boolean;
        message?: string;
        error?: string;
      };

      const updatedResults: BulkUpdateResult[] = [];

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return this.utilService.failResponse('No candidate IDs provided.');
      }

      if (!updates || !Array.isArray(updates) || updates.length === 0) {
        return this.utilService.failResponse('No update fields provided.');
      }

      const setData = updates
        .filter(u => u.action === 'change_to') // Only process 'change_to' actions
        .map(u => `${u.field}='${u.value}'`);

      for (const id of ids) {
        try {
          const where = [`id=${id}`];
          const result = await this.dbService.updateData('candidates', setData, where);

          if (result.affectedRows === 0) {
            updatedResults.push({ id, updated: false, message: 'No record updated' });
          } else {
            updatedResults.push({ id, updated: true });
          }
        } catch (error) {
          updatedResults.push({ id, updated: false, error: error.message });
        }
      }
      return this.utilService.successResponse(updatedResults, 'Candidate Bulk Updation has been Done .');
    } catch (err) {
      console.error('Bulk update failed:', err);
      return this.utilService.failResponse('An error occurred during bulk update.');
    }
  }



  async bulkDeleteCandidates(id: number | number[]) {
    try {
      // Prepare the condition
      let condition = '';
      if (Array.isArray(id)) {
        if (id.length === 0) {
          return this.utilService.failResponse(null, "No IDs provided.");
        }
        const idList = id.map(Number).join(','); // Ensures all are numbers
        condition = `id IN (${idList})`;
      } else {
        condition = `id = ${Number(id)}`;
      }

      const query = `DELETE FROM "candidates" WHERE ${condition} RETURNING *;`;
      const result = await this.dbService.execute(query);

      if (result.length === 0) {
        return this.utilService.failResponse(null, "User(s) not found or already deleted.");
      }

      return this.utilService.successResponse(result, "User(s) deleted successfully.");
    } catch (error) {
      console.error('Delete jobs Error:', error);
      throw new Error(error.message || error);
    }
  }
  async createCandidatesNotes(dto: CandidateNotesDto) {
    try {
      const setData = [
        { set: 'candidate_id', value: String(dto.candidate_id) },
        { set: 'author_id', value: String(dto.author_id) },
        { set: 'note', value: String(dto.note) },
      ];
      const insertion = await this.dbService.insertData('candidate_notes', setData);
      return this.utilService.successResponse(insertion, 'Candidate Notes created successfully.');
    } catch (error) {
      console.error('Create candidate Error:', error);
      throw error;
    }
  }


  async updateCandidateNotes(id: number, dto: updateCandidateNotesDto) {
    try {
      // Convert DTO to key=value pairs for update
      const set = Object.entries(dto).map(([key, value]) => `${key}='${value}'`);
      const where = [`id=${id}`];
      const updateResult = await this.dbService.updateData('candidate_notes', set, where);
      if (updateResult.affectedRows === 0) {
        return this.utilService.failResponse('candidates notes  not found or no changes made.');
      }
      return this.utilService.successResponse('candidates Notes updated successfully.');
    } catch (error) {
      console.error('Error updating candidates Notes:', error);
      return this.utilService.failResponse('Failed to update candidates, Notes');
    }
  }

  

    async getCandidateNotes(id: number) {
    const query = `SELECT * FROM candidate_notes WHERE candidate_id = ${id}`;
    const result = await this.dbService.execute(query);
    if (!result.length) {
      throw new NotFoundException(`candidates with ID ${id} not found`);
    }
    return this.utilService.successResponse(result, "Candidates Notes retrieved successfully.");
  }

}
