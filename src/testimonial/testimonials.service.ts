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
        (message,author_name,author_designation,company,star_rating)
        VALUES ($1,$2,$3,$4,$5)
        RETURNING *;
      `;
   const values = [
  dto.message, // message
  dto.author_name || 'Admin', // Default author_name to 'Admin' if not provided
  dto.author_designation || '', // Default to empty string if not provided
  dto.company || null, // Use null if company is not provided
  dto.star_rating || null, // Use null if star_rating is not provided
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
      SET message = $1,
          author_name = $2,
          author_designation = $3,
          company = $4,
          star_rating = $5,
          updated_at = NOW()
      WHERE id = $6
      RETURNING *;
    `;

    const values = [
      dto.message,                       // message
      dto.author_name || 'Admin',        // default to 'Admin'
      dto.author_designation || '',      // default empty string
      dto.company || null,               // null if not provided
      dto.star_rating || null,           // null if not provided
      id,                                // where id = $6
    ];

    const result = await this.dbService.executeQuery(query, values);

    if (!result.length) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }

    return this.utilService.successResponse(
      result[0],
      'Testimonial updated successfully.'
    );
  } catch (error) {
    console.error(`Error updating testimonial with ID ${id}:`, error);
    throw error instanceof NotFoundException
      ? error
      : new InternalServerErrorException('Failed to update testimonial');
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
