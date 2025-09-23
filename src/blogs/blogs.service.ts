import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateBlogDto,UpdateBlogDto } from './blogs.dto';
import { UtilService } from "../util/util.service";
import { DbService } from '../db/db.service'; // adjust path to your dbService

@Injectable()
export class BlogsService {
  constructor(private readonly dbService: DbService,public utilService: UtilService) {}

  // 📌 Get All Pages
  async getAllblogs() {
    try {
      const query = 'SELECT * FROM blogs ORDER BY updated_at DESC';
      const list = await this.dbService.execute(query);
      return list.length > 0 ? list : [];
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      throw new InternalServerErrorException('Failed to fetch blogs');
    }
  }

  // 📌 Get Page By ID
  async getBlogsById(id: number) {
    try {
      const query = `SELECT * FROM blogs WHERE id ={$id}`;
      const result = await this.dbService.execute(query);

      if (result.length === 0) {
        throw new NotFoundException(`blogs with ID ${id} not found`);
      }
      return result[0];
    } catch (error) {
      console.error(`Error fetching blogs by ID ${id}:`, error);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Failed to fetch blogs');
    }
  }

  // 📌 Create Page
  async createBlog(dto: CreateBlogDto) {
    try {
      const query = `
        INSERT INTO blogs
        (title, slug, content, meta_title, meta_description, meta_keywords, og_title, og_description, og_image, status, created_at, updated_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW(),NOW())
        RETURNING *;
      `;
      const values = [
        dto.title,
        dto.content,
        dto.author || null,
        dto.imageUrl || null,
      ];

      const result = await this.dbService.executeQuery(query, values);
      return this.utilService.successResponse(result[0], 'blogs Add Successfully.');
    } catch (error) {
      console.error('Error creating page:', error);
      throw new InternalServerErrorException('Failed to create blogs');
    }
  }

  // 📌 Update Page
  async updateBlog(id: number, dto: UpdateBlogDto) {
    try {
      const query = `
        UPDATE blogs
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
        dto.title,
        dto.content,
        dto.author || null,
        dto.imageUrl || null,
      ];
    const result = await this.dbService.executeQuery(query, values);
      return this.utilService.successResponse(result[0], 'blogs updated Successfully.');
      return result[0];
    } catch (error) {
      console.error(`Error updating page with ID ${id}:`, error);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Failed to update blogs');
    }
  }

  // 📌 Delete Page
  async deleteBlog(id: number) {
    try {
      const query = 'DELETE FROM blogs WHERE id = $1 RETURNING *';
     const result = await this.dbService.executeQuery(query, [id]);

      if (result.length === 0) {
        throw new NotFoundException(`blogs with ID ${id} not found`);
      }
      return this.utilService.successResponse(`testimonials with ID ${id} deleted successfully` );
    } catch (error) {
      console.error(`Error deleting blogs with ID ${id}:`, error);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Failed to delete blogs');
    }
  }
}
