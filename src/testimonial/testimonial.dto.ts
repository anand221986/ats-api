import { IsOptional } from 'class-validator';

export class CreateTestimonialDto {
  message: string; // TEXT (collation and constraints will be managed in the DB)
  
  author_name: string; // VARCHAR(255)

  author_designation: string; // VARCHAR(255)

  @IsOptional()
  company?: string; // VARCHAR(255), optional field
  
  star_rating: number; // INTEGER
}

export class UpdateTestimonialDto extends CreateTestimonialDto {}
