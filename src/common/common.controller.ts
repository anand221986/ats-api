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
  ContactFormDto,
  SaveCMSDto,
  SendWhatsappQuoteDto,
  SubmitLandingQueryDto,
  SubmitQueryDto,
  UpdateConstantsDto,
  UpdateCurrencyDto,
  UploadImageToCdnDto,
  UploadPassengerImageDto,
  UploadVideoToCDNDto,
  UserSkill
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
  constructor(public service: CommonService) { }

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

  @Get("getDashboardStats")
  @ApiOperation({ summary: 'Get all Dashboard' })
  async getAll(@Res() res: Response) {
    let data = await this.service.getDashboardStats();
    return res.status(HttpStatus.OK).json(data);
  }

  @Post("addLead")
  @ApiOperation({ summary: 'Submit contact form' })
  @ApiBody({ type: ContactFormDto })
  async submitContactForm(
    @Body() contactFormDto: ContactFormDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.service.storeLead(contactFormDto);
      return res.status(200).json(result);
    }
    catch (error) {
      console.error('Contact form submission error:', error);
      return res.status(500).json({
        status: false,
        message: error.message || 'Failed to submit contact form',
        error: 'Internal Server Error',
      });
    }
  }



@Get("getSkills")
@ApiOperation({ summary: 'Get all user skills' })
async getUserSkills(@Res() res: Response) {
  try {
    const skills = await this.service.getUserSkills();
    return res.status(200).json({ data: skills });
  } catch (error) {
    console.error("Error fetching user skills:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

  @Post("addskills")
  //@UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Add Skills' })
  @ApiBody({ type: UserSkill })
  async addSkill(
    @Body() userSkill: UserSkill,
    @Res() res: Response,
  ) {
    try {
      const result = await this.service.addUserSkill(userSkill);
      return res.status(200).json(result);
    }
    catch (error) {
      console.error('Contact form submission error:', error);
      return res.status(500).json({
        status: false,
        message: error.message || 'Failed to submit contact form',
        error: 'Internal Server Error',
      });
    }
  }

}
