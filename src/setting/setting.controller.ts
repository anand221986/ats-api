// jobs.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { SettingService } from './setting.service';
import { CreateTemplateDto,UpdateTemplateDto } from './setting.dto';
import {ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
@Controller('settings')
@ApiTags('settings')
export class SettingsController {
     constructor(private readonly settingService: SettingService) { }
      @Post("createTemplate")
      @ApiOperation({ summary: 'Create a new Template' })
      @ApiBody({ type: CreateTemplateDto })
      @ApiResponse({ status: 200, description: 'Template created successfully' })
      @ApiResponse({ status: 201, description: 'Template not created' })
      @ApiResponse({ status: 500, description: 'Internal server error' })
      async create(@Body() body: CreateTemplateDto, @Res() res: Response) {
        const template = await this.settingService.createTemplate(body);
        return res.status(HttpStatus.CREATED).json(template);
      }

        @Get("getAllTemplates")
        @ApiOperation({ summary: 'Get all Templates' })
        async getAll(@Res() res: Response) {
          try {
            const jobs = await this.settingService.getAllTemplates();
            return res.status(HttpStatus.OK).json(jobs);
          }
          catch (error) {
            return res
              .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
              .json(error.response || { message: error.message });
          }
         
        }
      
        @Get('templates/:id')
        @ApiOperation({ summary: 'Get Templates by ID' })
        @ApiParam({ name: 'id', type: Number })
        @ApiResponse({ status: 200, description: 'Get Templates Deatils successfully' })
        @ApiResponse({ status: 404, description: 'Templates not found' })
        @ApiResponse({ status: 500, description: 'Internal server error' })
        async getById(@Param('id') id: number, @Res() res: Response) {
          try {
            const job = await this.settingService.getTemplateById(+id);
            return res.status(HttpStatus.OK).json(job);
          } catch (error) {
            return res
              .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
              .json(error.response || { message: error.message });
          }
        }
      
        @Put('templates/:id')
        @ApiOperation({ summary: 'Update Templates by ID' })
        @ApiParam({ name: 'id', type: Number })
        @ApiBody({ type: UpdateTemplateDto })
        @ApiResponse({ status: 200, description: 'Templates updated successfully' })
        @ApiResponse({ status: 404, description: 'Templates not found' })
        @ApiResponse({ status: 500, description: 'Internal server error' })
        @ApiOperation({ summary: 'Update Templates by ID' })
        @ApiParam({ name: 'id', type: Number })
        @ApiBody({ type: UpdateTemplateDto })
        async update(@Param('id') id: number, @Body() body: UpdateTemplateDto, @Res() res: Response) {
          const job = await this.settingService.updateTemplate(id, body);
          return res.status(HttpStatus.OK).json(job);
        }
      
        @Delete('templates/:id')
        @ApiOperation({ summary: 'Delete Templates by ID' })
        @ApiParam({ name: 'id', type: Number })
        @ApiResponse({ status: 200, description: 'Templates Deleted successfully' })
        @ApiResponse({ status: 404, description: 'Templates not found' })
        @ApiResponse({ status: 500, description: 'Internal server error' })
        async delete(@Param('id') id: number, @Res() res: Response) {
          const job = await this.settingService.deleteTemplateById(id);
          return res.status(HttpStatus.OK).json({ message: 'Job deleted', job });
        }




}