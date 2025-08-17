// jobs.service.ts
import { Injectable, NotFoundException,HttpException,HttpStatus } from '@nestjs/common';
import { CreateTemplateDto,UpdateTemplateDto } from './setting.dto';
import { DbService } from "../db/db.service";
import { UtilService } from "../util/util.service";
@Injectable()
export class SettingService {
  constructor(
    public dbService: DbService,
    public utilService: UtilService,
  ) {
  }

async createTemplate(dto: CreateTemplateDto) {
    try {
      // Prepare the data for insertion
      const setData = [
        { set: 'template_name', value: String(dto.template_name) },
        { set: 'template_type', value: String(dto.template_type) },
        { set: 'subject', value: dto.subject ? String(dto.subject) : null },
        { set: 'body', value: dto.body ? String(dto.body) : null },
      ];

      // Insert the template into the "templates" table
      const insertedTemplate = await this.dbService.insertData('templates', setData);

      if (!insertedTemplate?.id) {
        throw new Error('Failed to retrieve template ID after insertion.');
      }

      return this.utilService.successResponse(
        insertedTemplate,
        'Template created successfully.'
      );
    } catch (error) {
      console.error('Create Template Error:', error);
      throw new HttpException(
        `Failed to create template: ${error?.message || 'Unknown error'}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  
    async getAllTemplates() {
        const query = `
SELECT * FROM  
templates order by 
   id DESC;
`;
        const result = await this.dbService.execute(query);
        return this.utilService.successResponse(result, "Templates list retrieved successfully.");
    }


     async getTemplateById(id: number) {
    const query = `SELECT * FROM templates WHERE id = ${id}`;
    const result = await this.dbService.execute(query);
    
    if (!result.length) {
      throw new NotFoundException(`Templates with ID ${id} not found`);
    }
    return this.utilService.successResponse(result, "templates  retrieved successfully.");
  }

  async updateTemplate(id: number, dto: UpdateTemplateDto) {
    try {
      // Convert DTO to key=value pairs for update
      // const set = Object.entries(dto).map(([key, value]) => `${key}='${value}'`);

      const set = Object.entries(dto).map(([key, value]) => {
        // Default handling (wrap in quotes)
        return `${key}='${value}'`;
      });
      const where = [`id=${id}`];
      const updateResult = await this.dbService.updateData('templates', set, where);
      if (updateResult.affectedRows === 0) {
        return this.utilService.failResponse('templates not found or no changes made.');
      }
      return this.utilService.successResponse(updateResult, 'templates updated successfully.');
    } catch (error) {
      console.error('Error updating templates:', error);
      return this.utilService.failResponse('Failed to update templates.');
    }
  }



    async deleteTemplateById(id: number) {
    try {
      const query = `DELETE FROM "templates" WHERE id='${id}' RETURNING *;`;
      const result = await this.dbService.execute(query);
      if (result.length === 0) {
        return this.utilService.failResponse(null, "Templates not found or already deleted.");
      }
      return this.utilService.successResponse(result[0], "Templates deleted successfully.");

    }
    catch (error) {

      console.error('Delete templates Error:', error);
      throw new Error(error);
    }
  }

}

 
  

 
