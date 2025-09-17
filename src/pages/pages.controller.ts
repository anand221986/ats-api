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
import { PageService } from "./pages.service";

@ApiTags("pages")
@Controller("pages")
export class PagesController {
  constructor(
    public pagesService: PageService,
  ) {}
  @Get("getAllPages")
  @ApiOperation({ summary: "Get all pages" })
  async getAllUsers(@Res() res: Response) {
    const users = await this.pagesService.getAllPages();
    res.status(HttpStatus.OK).json(users);
  }

 
}
