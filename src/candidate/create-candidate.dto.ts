
import { IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateCandidateDto  {
  first_name: string;
  last_name: string;
  email: string;
  headline?: string;
  phone?: string;
  address?: string;
  photo_url?: string;
  education?: string;
  experience?: string;
  summary?: string;
  resume_url?: string;
  cover_letter?: string;
  current_company?: string;
  current_ctc?: number;
  expected_ctc?: number;
  skill?: string[]; // Array of skills
  college?: string;
  degree?: string;
  rating?: number;  // Rating like 4.5
  extra?: string;   // Optional extra field
  
}
export class assignedJobDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  jobIds: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  candidateIds: number[];
}
export class UpdateCandidateDto extends CreateCandidateDto {}
export class UpdateActionDto {
  field: string;
  action: 'change_to'; // can be extended later
  value: any;
}

export class BulkUpdateCandidateDto {
  ids: number[];
  updates: UpdateActionDto[];
}

export class BulkDeleteCandidateDto {
  data: {
    ids: number[];
  };
}

export class CandidateNotesDto {
  candidate_id: number;
  author_id: number;
  note: string;
}


export class updateCandidateNotesDto {
  id: number;
  note: string;
}