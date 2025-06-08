// jobs.service.ts
import { Injectable,NotFoundException } from '@nestjs/common';
import { CreateCandidateDto,UpdateCandidateDto } from './create-candidate.dto';
import { DbService } from "../db/db.service";
import { UtilService } from "../util/util.service";

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
  { set: 'headline', value: dto.headline ?? '' },
  { set: 'phone', value: dto.phone ?? '' },
  { set: 'address', value: dto.address ?? '' },
  { set: 'photo_url', value: dto.photo_url ?? '' },
  { set: 'education', value: dto.education ?? '' },
  { set: 'experience', value: dto.experience ?? '' },
  { set: 'summary', value: dto.summary ?? '' },
  { set: 'resume_url', value: dto.resume_url ?? '' },
  { set: 'cover_letter', value: dto.cover_letter ?? '' },
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
  const query = `SELECT * FROM "candidates" ORDER BY id ASC;`;
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
    const index = this.jobs.findIndex((job) => job.id === id);
    if (index !== -1) {
      this.jobs[index] = { ...this.jobs[index], ...dto };
      return this.jobs[index];
    }
    return null;
  }

  async deleteCandidate(id: number) {
    const index = this.jobs.findIndex((job) => job.id === id);
    if (index !== -1) {
      const removed = this.jobs.splice(index, 1);
      return removed[0];
    }
    return null;
  }


 
}
