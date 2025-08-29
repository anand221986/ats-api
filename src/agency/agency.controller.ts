import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Delete,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from "@nestjs/swagger";
import { AgencyService } from "./agnecy.service";
import {
  CreateAgencyDto,
  UpdateAgencyDto
} from "./agency.dto";
@ApiTags("Agencies")
@Controller("agency")
export class AgencyController {
  constructor(
    public service: AgencyService,
  ) {}




  // @UseGuards(AuthGuard)
  @Get("getAllAgencies")
  @ApiOperation({ summary: 'Get all Candidate' })
  async getAll(@Res() res: Response) {
    const jobs = await this.service.getAllAgencies();
    return res.status(HttpStatus.OK).json(jobs);
  }
  

 
}
