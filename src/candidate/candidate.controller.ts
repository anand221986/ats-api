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
import { CandidateService} from './candidate.service';
import { Response,Express  } from 'express';
import { CreateCandidateDto ,UpdateCandidateDto,UpdateActionDto,BulkUpdateCandidateDto, BulkDeleteCandidateDto } from './create-candidate.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam,ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('candidate')
@ApiTags('candidate')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

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


  @Get("getAllCandidates")
  @ApiOperation({ summary: 'Get all Candidate' })
  async getAll(@Res() res: Response) {
    const jobs = await  this.candidateService.getAllCandidates();
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
  @ApiBody({ type:UpdateCandidateDto  })
  async update(@Param('id') id: number, @Body() body: UpdateCandidateDto , @Res() res: Response) {
    const job = this.candidateService.updateCandidate(id, body);
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
    const response =   await this.candidateService.assignCandidatesToJobs(body.jobIds, body.candidateIds);
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
  @UseInterceptors(FileInterceptor('resumes', {
    storage: diskStorage({
      destination: './uploads',
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
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { jobIds: number[]; candidateIds: number[] },
    @Res() res: Response,
  ): Promise<any> {
    try {
  
   const pdfPath = file.path; // full path to uploaded PDF
   const extractedData = await this.candidateService.runPythonScriptWithSpawn(pdfPath);
      // Do something with the uploaded PDF file if needed (file.path)
      const response ='PDF file uploaded successfully'
  
    
  const result = await this.candidateService.insertExtractedData(extractedData);

  if (!result.status) {
      return res.status(HttpStatus.CONFLICT).json(result);
    }
   // return res.status(HttpStatus.CREATED).json(result);
      return res.status(HttpStatus.CREATED).json({
      message: 'Bulk operation successful',
      fileName: file.filename,
     extractedData, // Python parsed output
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







}
