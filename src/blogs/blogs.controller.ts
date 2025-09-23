import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto, UpdateBlogDto } from './blogs.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiResponse, ApiConsumes } from '@nestjs/swagger';

@ApiTags('blogs') // Group in Swagger
@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Blog created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/blogs',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(
    @Body() dto: CreateBlogDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      if (file) {
        dto.imageUrl = `/uploads/blogs/${file.filename}`;
      }
      return await this.blogsService.createBlog(dto);
    } catch (error) {
      throw new HttpException(
        { message: 'Failed to create blog', error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List of blogs retrieved.' })
  async findAll() {
    try {
      return await this.blogsService.getAllblogs();
    } catch (error) {
      throw new HttpException(
        { message: 'Failed to fetch blogs', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Blog retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Blog not found.' })
  async findOne(@Param('id') id: string) {
    try {
      return await this.blogsService.getBlogsById(+id);
    } catch (error) {
      throw new HttpException(
        { message: 'Failed to fetch blog', error: error.message },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Blog updated successfully.' })
  @ApiResponse({ status: 404, description: 'Blog not found.' })
  async update(@Param('id') id: string, @Body() dto: UpdateBlogDto) {
    try {
      return await this.blogsService.updateBlog(+id, dto);
    } catch (error) {
      throw new HttpException(
        { message: 'Failed to update blog', error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Blog deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Blog not found.' })
  async remove(@Param('id') id: string) {
    try {
      return await this.blogsService.deleteBlog(+id);
    } catch (error) {
      throw new HttpException(
        { message: 'Failed to delete blog', error: error.message },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
