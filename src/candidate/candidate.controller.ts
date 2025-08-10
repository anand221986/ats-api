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
  UploadedFiles,
  UseGuards,
 
} from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { Response, Express } from 'express';
import { CreateCandidateDto, UpdateCandidateDto, UpdateActionDto, BulkUpdateCandidateDto, BulkDeleteCandidateDto, CandidateNotesDto, updateCandidateNotesDto, CandidateTaskDto, updateCandidateTaskDto, RateCandidateDto, UpdateCandidateJobAssignmentDto } from './create-candidate.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '../auth/auth.guard';


interface ExtractedDataItem {
  fileName: string;
  extractedData: any; // Replace 'any' with a specific type if you have one
}
 const allResults: {
      fileName: string;
      success: boolean;
      message: string;
      extractedData?: any;
    }[] = []
@Controller('candidate')
@ApiTags('candidate')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) { }
// @UseGuards(AuthGuard)
  @Post("createCandidate")
  @ApiOperation({ summary: 'Create a new candidate' })
  @ApiResponse({ status: 201, description: 'Candidates created' })
  @ApiBody({ type: CreateCandidateDto })
  async create(@Body() body: CreateCandidateDto, @Res() res: Response) {
    try {
      const result = await this.candidateService.createCandidate(body);
      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      console.error('Create candidate error:', error);
      // Check for duplicate email
      if (error.message.includes('already exists')) {
        return res.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          message: error.message,
        });
      }

      // Default to bad request
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Failed to create candidate.',
        error: error.message,
      });
    }
  }

// @UseGuards(AuthGuard)
  @Get("getAllCandidates")
  @ApiOperation({ summary: 'Get all Candidate' })
  async getAll(@Res() res: Response) {
    const jobs = await this.candidateService.getAllCandidates();
    return res.status(HttpStatus.OK).json(jobs);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get candidate by ID' })
  @ApiParam({ name: 'id', type: Number })
  async getById(@Param('id') id: number, @Res() res: Response) {
    try {
      const candidate = await this.candidateService.getCandidateId(+id);
      return res.status(HttpStatus.OK).json(candidate);
    } catch (error) {
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json(error.response || { message: error.message });
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update candidate by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateCandidateDto })
  async update(@Param('id') id: number, @Body() body: UpdateCandidateDto, @Res() res: Response) {
    const job = await this.candidateService.updateCandidate(id, body);
    return res.status(HttpStatus.OK).json(job);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete candidate by ID' })
  @ApiParam({ name: 'id', type: Number })
  async delete(@Param('id') id: number, @Res() res: Response) {
    const job = this.candidateService.bulkDeleteCandidates(id);
    return res.status(HttpStatus.OK).json({ message: ' Candidate deleted', job });
  }

  @Post('createCandidatesBulk')
  @ApiOperation({ summary: 'Create multiple candidates' })
  @ApiBody({ type: [CreateCandidateDto] }) // <== Array of DTOs
  @ApiResponse({ status: 201, description: 'Candidates created' })
  async createCandidatesBulk(
    @Body() dtos: CreateCandidateDto[],
    @Res() res: Response,
  ) {
    try {
      const response = await this.candidateService.createCandidatesBulk(dtos);
      if (!response.status) {
        return res.status(HttpStatus.CONFLICT).json(response);
      }
      return res.status(HttpStatus.CREATED).json(response);
    } catch (error) {
      console.error('Bulk insert error:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to insert candidates',
      });
    }
  }

  //assign candidate to the jobs
  @Post('assignCandidates')
  @ApiOperation({ summary: 'Assign multiple candidates to multiple jobs' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        jobIds: { type: 'array', items: { type: 'number' }, example: [15] },
        candidateIds: { type: 'array', items: { type: 'number' }, example: [25] },
      },
      required: ['jobIds', 'candidateIds'],
    },
  })
  async assignCandidatesToJobs(
    @Body() body: { jobIds: number[]; candidateIds: number[] },
    @Res() res: Response,
  ) {
    try {
      const response = await this.candidateService.assignCandidatesToJobs(body.jobIds, body.candidateIds);
      return res.status(HttpStatus.CREATED).json(response);
    } catch (error) {
      console.error('Bulk update error:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to insert candidates',
      });
    }
  }

  //upload resume of the candidate
  @Post('uploadPdf')
  @UseInterceptors(FilesInterceptor('resumes', 10, {
    storage: diskStorage({
      // destination: './uploads',
      destination: '/var/www/html/ats-api/uploads',
      
      filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueName}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only PDF files are allowed'), false);
      }
    },
  }))
  async bulk(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: { job_id: number; candidateIds: number[] },
    @Res() res: Response,
  ): Promise<any> {
    try {
      const { job_id, candidateIds } = body;
      const allExtractedData: ExtractedDataItem[] = [];
      for (const file of files) {
        const pdfPath = file.path;
        const extractedData = await this.candidateService.runPythonScriptWithSpawn(pdfPath);
        const result = await this.candidateService.insertExtractedData(job_id,extractedData,file.filename);

        if (!result.status) {
          allResults.push({
            fileName: file.filename,
            success: false,
            message: result.message || 'Conflict inserting data (e.g. duplicate email)',
          });
          continue;
        } else {
          allResults.push({
            fileName: file.filename,
            success: true,
            message: 'Inserted successfully',
            extractedData,
          });
        }

        allExtractedData.push({
          fileName: file.filename,
          extractedData,
        });
      }
      return res.status(HttpStatus.CREATED).json({
        message: 'Bulk operation successful',
        uploadedFiles: allExtractedData,
        results: allResults,
      });
    } catch (error) {
      console.error('Bulk update error:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to uploadFile',
      });
    }
  }
  //bulk update candidate
  @Post('bulk-update')
  @ApiOperation({ summary: 'Bulk update candidates' })
  @ApiBody({ type: BulkUpdateCandidateDto })
  async bulkUpdateCandidates(
    @Body() body: BulkUpdateCandidateDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.candidateService.bulkUpdateCandidates(body.ids, body.updates);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.error('Bulk update error:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to update candidates',
        error: error.message,
      });
    }
  }
  //bulk Delete Candidate:
  @Post('bulk-delete')
  @ApiOperation({ summary: 'Bulk deletion of candidates' })
  @ApiBody({ type: BulkDeleteCandidateDto })
  async bulkDeleteCandidates(
    @Body() body: BulkDeleteCandidateDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.candidateService.bulkDeleteCandidates(body.data.ids);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.error('Bulk delete error:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to delete candidates',
        error: error.message,
      });
    }
  }



  @Post('addCandidateNotes')
  @ApiOperation({ summary: 'add Candidate Notes' })
  @ApiBody({ type: CandidateNotesDto }) // <== Array of DTOs
  @ApiResponse({ status: 201, description: 'notes created' })
  async addCandidateNotes(
    @Body() dtos: CandidateNotesDto,
    @Res() res: Response,
  ) {
    try {
      const response = await this.candidateService.createCandidatesNotes(dtos);
      return res.status(HttpStatus.CREATED).json(response);
    } catch (error) {
      console.error('candidate notes Insertion error:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to insert candidate notes',
      });
    }
  }

  @Post('notes/:id')
  @ApiOperation({ summary: 'Update candidate notes  by notesId' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: updateCandidateNotesDto })
  async updateNotes(@Param('id') id: number, @Body() body: updateCandidateNotesDto, @Res() res: Response) {
    const jobResult = await this.candidateService.updateCandidateNotes(id, body);
    return res.status(HttpStatus.OK).json(jobResult);

  }

  @Get('notes/:id')
  @ApiOperation({ summary: 'Get Candidate Notes By Id' })
  @ApiParam({ name: 'id', type: Number })
  async getCandidateNotes(@Param('id') id: number, @Res() res: Response) {
    const jobResult = await this.candidateService.getCandidateNotes(id);
    return res.status(HttpStatus.OK).json(jobResult);

  }


  @Post('addCandidateTask')
  @ApiOperation({ summary: 'add Candidate Task' })
  @ApiBody({ type: CandidateTaskDto }) // <== Array of DTOs
  @ApiResponse({ status: 201, description: 'task created' })
  async addCandidateTask(
    @Body() dtos: CandidateTaskDto,
    @Res() res: Response,
  ) {
    try {
      const response = await this.candidateService.createCandidatesTask(dtos);
      return res.status(HttpStatus.CREATED).json(response);
    } catch (error) {
      console.error('candidate Task Insertion error:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to insert candidate Task',
      });
    }
  }

  @Post('task/:id')
  @ApiOperation({ summary: 'Update candidate task  by task Id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: updateCandidateTaskDto })
  async updateTask(@Param('id') id: number, @Body() body: updateCandidateTaskDto, @Res() res: Response) {
    const jobResult = await this.candidateService.updateCandidateTask(id, body);
    return res.status(HttpStatus.OK).json(jobResult);

  }

  @Get('task/:id')
  @ApiOperation({ summary: 'Get Candidate task By candidateId' })
  @ApiParam({ name: 'id', type: Number })
  async getCandidateTask(@Param('id') id: number, @Res() res: Response) {
    const jobResult = await this.candidateService.getCandidateTask(id);
    return res.status(HttpStatus.OK).json(jobResult);

  }

    @Get('candidateResumes/:id')
  @ApiOperation({ summary: 'Get Candidate task By candidateId' })
  @ApiParam({ name: 'id', type: Number })
  async getcandidateResumes(@Param('id') id: number, @Res() res: Response) {
    const jobResult = await this.candidateService.getCandidateResumes(id);
    return res.status(HttpStatus.OK).json(jobResult);

  }

  @Put('candidateRating:id')
  @ApiOperation({ summary: 'Update candidate Rating by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateCandidateDto })
  async candidateRating(@Param('id') id: number, @Body() dto: RateCandidateDto, @Res() res: Response) {
    const job = await this.candidateService.rateCandidate(dto);
    return res.status(HttpStatus.OK).json(job);
  }



@Put('candidate-job-assignment/update')
@ApiOperation({ summary: 'Update candidate job mapping field' })
@ApiBody({ type: UpdateCandidateJobAssignmentDto })
async jobMappingUpdate(
  @Body() dto: UpdateCandidateJobAssignmentDto,
  @Res() res: Response,
) {
  try {
    // Manually check if body is missing or empty
    if (!dto || Object.keys(dto).length === 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Request body is missing',
      });
    }

    // Extra manual checks if needed
    if (!dto.candidateId || !dto.jobId || !dto.field || !dto.value) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Required fields are missing',
      });
    }

    const result = await this.candidateService.updateCandidateJobAssignment(dto);
    return res.status(HttpStatus.OK).json(result);

  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Error updating candidate job mapping',
      error: error.message,
    });
  }
}


  

 
}
