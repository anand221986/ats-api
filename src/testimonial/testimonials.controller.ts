import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TestimonialService } from './testimonials.service';
import { CreateTestimonialDto, UpdateTestimonialDto } from './testimonial.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('testimonials') // Groups endpoints in Swagger
@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Testimonial created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async create(@Body() dto: CreateTestimonialDto) {
    try {
      return await this.testimonialsService.createTestimonial(dto);
    } catch (error) {
      throw new HttpException(
        { message: 'Failed to create testimonial', error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List of testimonials retrieved.' })
  async findAll() {
    try {
      return await this.testimonialsService.getAllTestimonial();
    } catch (error) {
      throw new HttpException(
        { message: 'Failed to fetch testimonials', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Testimonial retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Testimonial not found.' })
  async findOne(@Param('id') id: string) {
    try {
      return await this.testimonialsService.getTestimonialById(+id);
    } catch (error) {
      throw new HttpException(
        { message: 'Failed to fetch testimonial', error: error.message },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Testimonial updated successfully.' })
  @ApiResponse({ status: 404, description: 'Testimonial not found.' })
  async update(@Param('id') id: string, @Body() dto: UpdateTestimonialDto) {
    try {
      return await this.testimonialsService.updateTestimonial(+id, dto);
    } catch (error) {
      throw new HttpException(
        { message: 'Failed to update testimonial', error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Testimonial deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Testimonial not found.' })
  async remove(@Param('id') id: string) {
    try {
      return await this.testimonialsService.deleteTestimonial(+id);
    } catch (error) {
      throw new HttpException(
        { message: 'Failed to delete testimonial', error: error.message },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
