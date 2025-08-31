import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  Get,
} from "@nestjs/common";
import { response, Response } from "express"; // You forgot this import
import { CommonService } from "./common.service";
import {AddCandidateDto,AddEmployerDto,AddProspectDto}  from  "./common.dto"
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

  @Post("addcandidate")
  @ApiOperation({ summary: 'Add Candidate' })
  @ApiBody({ type: AddCandidateDto })
  async addcandidate(
    @Body() userSkill: UserSkill,
    @Res() res: Response,
  ) {
    try {
      const result = await this.service.addcandidate(AddCandidateDto);
      return res.status(200).json(result);
    }
    catch (error) {
      console.error('Add Candidate  form submission error:', error);
      return res.status(500).json({
        status: false,
        message: error.message || 'Failed to submit contact form',
        error: 'Internal Server Error',
      });
    }
  }


    @Post("addemployer")
  @ApiOperation({ summary: 'Add Employer' })
  @ApiBody({ type: AddEmployerDto })
  async addemployer(
    @Body() userSkill: UserSkill,
    @Res() res: Response,
  ) {
    try {
      const result = await this.service.addEmployer(AddEmployerDto);
      return res.status(200).json(result);
    }
    catch (error) {
      console.error('Add Candidate  form submission error:', error);
      return res.status(500).json({
        status: false,
        message: error.message || 'Failed to submit contact form',
        error: 'Internal Server Error',
      });
    }
  }

 
   @Post('addprospect')
     @ApiOperation({ summary: 'Add Prospects' })
     @ApiBody({ type: AddProspectDto})
  async addProspect(@Body() dto: AddProspectDto,@Res() res: Response,) {
    try
    {
      const result = await this.service.addProspect(dto);
      return res.status(200).json(result);
    }
    catch(error)
    {

       console.error('Add prospects submission error:', error);
      return res.status(500).json({
        status: false,
        message: error.message || 'Failed to submit add prospects',
        error: 'Internal Server Error',
      });
    }
  }

}
