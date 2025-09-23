import { IsString, IsOptional } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  author: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
export class UpdateBlogDto extends CreateBlogDto {}