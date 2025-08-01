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
    UseInterceptors,
     UploadedFile,
} from '@nestjs/common';
import { Response } from 'express';
import { JobsService } from './jobs.service';
import { CreateJobDto, UpdateJobDto } from './jobs.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
 
@Controller('jobs')
@ApiTags('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  @Post("createJob")
  @ApiOperation({ summary: 'Create a new job' })
  @ApiBody({ type: CreateJobDto })
  @ApiResponse({ status: 200, description: 'Jobs created successfully' })
  @ApiResponse({ status: 201, description: 'Jobs not created' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async create(@Body() body: CreateJobDto, @Res() res: Response) {
    const job = await this.jobsService.createJob(body);
    return res.status(HttpStatus.CREATED).json(job);
  }
  @Get("getAllJobs")
  @ApiOperation({ summary: 'Get all jobs' })
  async getAll(@Res() res: Response) {
    const jobs = await this.jobsService.getAllJobs();
    return res.status(HttpStatus.OK).json(jobs);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get job by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Get Job Deatils successfully' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getById(@Param('id') id: number, @Res() res: Response) {
    try {
      const job = await this.jobsService.getJobById(+id);
      return res.status(HttpStatus.OK).json(job);
    } catch (error) {
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update job by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateJobDto })
  @ApiResponse({ status: 200, description: 'Job updated successfully' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiOperation({ summary: 'Update job by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateJobDto })
  async update(@Param('id') id: number, @Body() body: UpdateJobDto, @Res() res: Response) {
    const job = await this.jobsService.updateJob(id, body);
    return res.status(HttpStatus.OK).json(job);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete job by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Jobs Deleted successfully' })
  @ApiResponse({ status: 404, description: 'Jobs not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async delete(@Param('id') id: number, @Res() res: Response) {
    const job = await this.jobsService.deleteJobById(id);
    return res.status(HttpStatus.OK).json({ message: 'Job deleted', job });
  }

  @Get(':id/applicants')
  @ApiOperation({ summary: 'Get job Application  by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Get All  job candidate Application  successfully' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getJobApplicartionById(@Param('id') id: number, @Res() res: Response) {
    try {
      const job = await this.jobsService.getAllApplicantsByJobId(+id);
      return res.status(HttpStatus.OK).json(job);
    } catch (error) {
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }

   //JD parser functionality 
 @Post('extractJob')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Only PDF files are allowed'), false);
        }
      },
    }),
  )
  async job(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { jobIds: number[]; candidateIds: number[] },
    @Res() res: Response,
  ): Promise<any> {
    try {
      const allExtractedData: any[] = [];
       const allResults: any[] = [];
      const pdfPath = file.path;
      console.log(pdfPath,'pdf path')
       const extractedData = await this.jobsService.runPythonScriptWithSpawn(pdfPath);
      //const result = await this.jobsService.insertExtractedData(extractedData, file.filename);

      if (!extractedData) {
        allResults.push({
          fileName: file.filename,
          success: false,
          message: 'Uploaded File data not extracted properly.',
        });
      } else {
        allResults.push({
          fileName: file.filename,
          success: true,
          message: 'Inserted successfully',
          extractedData,
        });

        allExtractedData.push({
          fileName: file.filename,
          extractedData,
        });
      }

      return res.status(HttpStatus.CREATED).json({
        message: 'Operation successful',
        uploadedFiles: allExtractedData,
        results: allResults,
      });
    } catch (error) {
      console.error('File processing error:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to upload file',
      });
    }
  }
}
