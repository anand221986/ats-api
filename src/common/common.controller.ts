import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  Get,
} from "@nestjs/common";
import { Response } from "express"; // You forgot this import
import { CommonService } from "./common.service";
import {
  AddFixedPackageLeadDto,
  AddNewsletterDto,
  AddPackageCustomizeLeadDto,
  AddPackageImageDto,
  AddQueryDto,
  AddUTMSourceDto,
  SaveCMSDto,
  SendWhatsappQuoteDto,
  SubmitLandingQueryDto,
  SubmitQueryDto,
  UpdateConstantsDto,
  UpdateCurrencyDto,
  UploadImageToCdnDto,
  UploadPassengerImageDto,
  UploadVideoToCDNDto,
} from "./common.dto";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiConsumes,
} from "@nestjs/swagger";

@Controller("common")
export class CommonController {
  constructor(public service: CommonService) {}

  @Get("hello")
  @ApiOperation({
    summary: "Submit a landing query",
    description: "Endpoint for users to submit landing page queries.",
  })
  @ApiBody({
    description: "Request body for submitting a landing query",
    type: SubmitLandingQueryDto,
  })
  async getAllQueries(@Res() res: Response) {
    // let data = await this.service.getAllQueries();
    res.status(HttpStatus.OK).json("hello");
  }
}
