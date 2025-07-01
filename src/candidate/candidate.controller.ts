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
import { CandidateService} from './candidate.service';
import { Response } from 'express';
import { CreateCandidateDto ,UpdateCandidateDto } from './create-candidate.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam,ApiResponse } from '@nestjs/swagger';

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
    const job = this.candidateService.deleteCandidate(id);
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
    return res.status(HttpStatus.CREATED).json(response);
  } catch (error) {
    console.error('Bulk insert error:', error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to insert candidates',
    });
  }
}
}
