export class CreateCandidateDto {
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
}

export class UpdateCandidateDto extends CreateCandidateDto {}
