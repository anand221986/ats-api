import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service'; // adjust path to your dbService
import { CreatePageDto, UpdatePageDto } from './page.dto';

@Injectable()
export class PageService {
  constructor(private readonly dbService: DbService) {}

  // 📌 Get All Pages
  async getAllPages() {
    try {
      const query = 'SELECT * FROM pages ORDER BY updated_at DESC';
      const list = await this.dbService.execute(query);
      return list.length > 0 ? list : [];
    } catch (error) {
      console.error('Error fetching pages:', error);
      throw new InternalServerErrorException('Failed to fetch pages');
    }
  }

  // 📌 Get Page By ID
  async getPageById(id: number) {
    try {
      const query = `SELECT * FROM pages WHERE id ={$id}`;
      const result = await this.dbService.execute(query);

      if (result.length === 0) {
        throw new NotFoundException(`Page with ID ${id} not found`);
      }
      return result[0];
    } catch (error) {
      console.error(`Error fetching page by ID ${id}:`, error);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Failed to fetch page');
    }
  }

  // 📌 Create Page
  async createPage(dto: CreatePageDto) {
    try {
      const query = `
        INSERT INTO pages 
        (title, slug, content, meta_title, meta_description, meta_keywords, og_title, og_description, og_image, status, created_at, updated_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW(),NOW())
        RETURNING *;
      `;
      const values = [
        dto.title,
        dto.slug,
        dto.content || null,
        dto.metaTitle || null,
        dto.metaDescription || null,
        dto.metaKeywords || null,
        dto.ogTitle || null,
        dto.ogDescription || null,
        dto.ogImage || null,
        dto.status || 'draft',
      ];

      const result = await this.dbService.execute(query);
      return result[0];
    } catch (error) {
      console.error('Error creating page:', error);
      throw new InternalServerErrorException('Failed to create page');
    }
  }

  // 📌 Update Page
  async updatePage(id: number, dto: UpdatePageDto) {
    try {
      const query = `
        UPDATE pages 
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
        dto.slug,
        dto.content || null,
        dto.metaTitle || null,
        dto.metaDescription || null,
        dto.metaKeywords || null,
        dto.ogTitle || null,
        dto.ogDescription || null,
        dto.ogImage || null,
        dto.status || 'draft',
        id,
      ];

      const result = await this.dbService.execute(query);
      if (result.length === 0) {
        throw new NotFoundException(`Page with ID ${id} not found`);
      }
      return result[0];
    } catch (error) {
      console.error(`Error updating page with ID ${id}:`, error);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Failed to update page');
    }
  }

  // 📌 Delete Page
  async deletePage(id: number) {
    try {
      const query = 'DELETE FROM pages WHERE id = $1 RETURNING *';
      const result = await this.dbService.execute(query);

      if (result.length === 0) {
        throw new NotFoundException(`Page with ID ${id} not found`);
      }
      return { message: `Page with ID ${id} deleted successfully` };
    } catch (error) {
      console.error(`Error deleting page with ID ${id}:`, error);
      throw error instanceof NotFoundException ? error : new InternalServerErrorException('Failed to delete page');
    }
  }
}
