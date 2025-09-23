import { IsInt, IsString, Min, Max, IsOptional } from 'class-validator';

export class CreateTestimonialDto {
  @IsString()
  message: string;

  @IsString()
  authorName: string;

  @IsString()
  authorDesignation: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  starRating: number;
}
export class UpdateTestimonialDto extends CreateTestimonialDto {}
