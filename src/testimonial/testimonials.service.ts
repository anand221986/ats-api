import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service'; // adjust path to your dbService
import { CreateTestimonialDto, UpdateTestimonialDto} from './testimonial.dto';
import { UtilService } from "../util/util.service";
@Injectable()
export class TestimonialService {
  constructor(private readonly dbService: DbService,public utilService: UtilService) {}

  // 📌 Get All Pages
  async getAllTestimonial() {
    try {
      const query = 'SELECT * FROM testimonials ORDER BY updated_at DESC';
      const list = await this.dbService.execute(query);
      return list.length > 0 ? list : [];
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      throw new InternalServerErrorException('Failed to fetch testimonials');
    }
  }

  // 📌 Get Page By ID
  async getTestimonialById(id: number) {
    try {
      const query = `SELECT * FROM testimonials WHERE id ={$id}`;
      const result = await this.dbService.execute(query);

      if (result.length === 0) {
        throw new NotFoundException(`testimonials with ID ${id} not found`);
      }
      return result[0];
    } catch (error) {
      console.error(`Error fetching testimonials by ID ${id}:`, error);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Failed to fetch testimonials');
    }
  }

  // 📌 Create Page
  async createTestimonial(dto: CreateTestimonialDto) {
    try {
      const query = `
        INSERT INTO testimonials 
        (title, slug, content, meta_title, meta_description, meta_keywords, og_title, og_description, og_image, status, created_at, updated_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW(),NOW())
        RETURNING *;
      `;
      const values = [
        dto.message,
        dto.authorName,
        dto.authorDesignation || null,
        dto.company || null,
        dto.starRating || null,

      ];

      const result = await this.dbService.executeQuery(query, values);
      return this.utilService.successResponse(result[0], 'testimonials Add Successfully.');
    } catch (error) {
      console.error('Error creating page:', error);
      throw new InternalServerErrorException('Failed to create testimonials');
    }
  }

  // 📌 Update Page
  async updateTestimonial(id: number, dto: UpdateTestimonialDto) {
    try {
      const query = `
        UPDATE testimonials 
        SET title = $1,
            slug = $2,
            content = $3,
            meta_title = $4,
            meta_description = $5,
            meta_keywords = $6,
            og_title = $7,
            og_description = $8,
            og_image = $9,
            status = $10,
            updated_at = NOW()
        WHERE id = $11
        RETURNING *;
      `;
      const values = [
        dto.message,
        dto.authorName,
        dto.authorDesignation || null,
        dto.company || null,
        dto.starRating || null,
      ];
    const result = await this.dbService.executeQuery(query, values);
      return this.utilService.successResponse(result[0], 'testimonials updated Successfully.');
      return result[0];
    } catch (error) {
      console.error(`Error updating page with ID ${id}:`, error);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Failed to update testimonials');
    }
  }

  // 📌 Delete Page
  async deleteTestimonial(id: number) {
    try {
      const query = 'DELETE FROM testimonials WHERE id = $1 RETURNING *';
     const result = await this.dbService.executeQuery(query, [id]);

      if (result.length === 0) {
        throw new NotFoundException(`Page with ID ${id} not found`);
      }
      return this.utilService.successResponse(`testimonials with ID ${id} deleted successfully` );
    } catch (error) {
      console.error(`Error deleting page with ID ${id}:`, error);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Failed to delete testimonials');
    }
  }
}
