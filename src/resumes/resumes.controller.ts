import { Controller, Get, Param, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';

@Controller('users/:userId/resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Get()
  async getResumesByUserId(
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.resumesService.getResumesByUser(userId);
  }
}