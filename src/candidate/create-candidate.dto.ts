
import { IsArray, IsNumber,IsInt,Min,Max,IsString ,IsBoolean,IsOptional,IsNotEmpty} from 'class-validator';
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
  notice_period?:string
  
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

export class CandidateTaskDto {
  candidate_id: number;
  author_id: number;
  task: string;
}
export class updateCandidateTaskDto {
  id: number;
  task: string;
}

export class RateCandidateDto {
  @IsInt()
  candidate_id: number;

  @IsInt()
  job_id: number;

  @IsInt()
  rated_by: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsString()
  feedback: string;
}


export class UpdateCandidateJobAssignmentDto {
  @IsNumber()
  candidateId: number;

  @IsNumber()
  jobId: number;
  field: 'status' | 'recruiter_status' | 'hmapproval';
  @IsString()
  value: string;
}

export class CandidateSchedulesDto {
  @IsInt()
  candidate_id: number;
  @IsString()
  event_name: string;
  @IsString()
  event_description?: string;

  @IsInt()
  author_id: number;
}

export class CreateCandidateEmailDto {
  @IsInt()
  candidate_id: number;
  @IsString()
  emailSubject: string;
  @IsString()
  emailDescription?: string;
  @IsInt()
  author_id: number;
}

export class CreateCandidateSmsDto {
  @IsInt()
  candidate_id: number;
  @IsString()
  TextMessage: string;
  @IsInt()
  author_id: number;
}

export class CreateCallLogDto {
  @IsInt()
  candidate_id: number;
  @IsInt()
  author_id: number;
  meeting_date: string; // ISO date string, e.g. '2025-08-15'
  @IsString()
  meeting_type: string;
  @IsString()
  call_outcome: string;
  @IsString()
  call_notes?: string;
}


export class CreateStatusDto {
  @IsString()
  @IsNotEmpty()
  type: string;     // 'candidate' | 'recruiter'
  @IsString()
  @IsNotEmpty()
  name: string;     // ex. 'Screening', 'Offered', etc.
  @IsString()
  @IsOptional()
  color?: string;   // optional color (for badge)
  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;
  position:number;
  recuiter_status:[]
}

export class UpdateStatusDto extends CreateStatusDto {}