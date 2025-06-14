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
import { ClientService} from './client.service';
import { Response } from 'express';
import { CreateClientDto ,UpdateClientDto} from './client.service.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('client')
@ApiTags('client')
export class ClientController {
  constructor(private readonly candidateService:ClientService) {}

@Post("createClient")
@ApiOperation({ summary: 'Create a new client' })
@ApiBody({ type: CreateClientDto })
 async create(@Body() body: CreateClientDto, @Res() res: Response) {
    try {
      const result = await this.candidateService.createClient(body);
      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      console.error('Create Client error:', error);
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
        message: 'Failed to create client.',
        error: error.message,
      });
    }
  }


  @Get("getAllClient")
  @ApiOperation({ summary: 'Get all Client' })
  async getAll(@Res() res: Response) {
    const jobs = await  this.candidateService.getAllClient();
    console.log(jobs,'test')
    return res.status(HttpStatus.OK).json(jobs);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client by ID' })
  @ApiParam({ name: 'id', type: Number })
  async getById(@Param('id') id: number, @Res() res: Response) {
     try {
    const candidate = await this.candidateService.getClientId(+id);
    return res.status(HttpStatus.OK).json(candidate);
  } catch (error) {
    return res
      .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
      .json(error.response || { message: error.message });
  }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update client by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type:UpdateClientDto  })
  async update(@Param('id') id: number, @Body() body: UpdateClientDto , @Res() res: Response) {
    const job = this.candidateService.updateClient(id, body);
    return res.status(HttpStatus.OK).json(job);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete client by ID' })
  @ApiParam({ name: 'id', type: Number })
  async delete(@Param('id') id: number, @Res() res: Response) {
    const job = this.candidateService.deleteCandidate(id);
    return res.status(HttpStatus.OK).json({ message: ' Client deleted', job });
  }
}
