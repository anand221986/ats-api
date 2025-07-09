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
import { UserService } from "./user.service";
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  LoginAdminDto,
  RegisterDto
} from "./user.dto";
@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(
    public service: UserService,
  ) {}

@Post("login")
@ApiOperation({ summary: "Admin login" })
@ApiBody({ type: LoginAdminDto })
@ApiResponse({ status: 200, description: "Admin successfully logged in" })
@ApiResponse({ status: 401, description: "Invalid email or password" })
async loginAdmin(@Body() body: LoginAdminDto, @Res() res: Response) {
  const data = await this.service.loginAdmin(body);
  if (data) {
    return res.status(HttpStatus.OK).json({ message: data });
  } else {
    return res.status(HttpStatus.UNAUTHORIZED).json({ message: data });
  }
}
 @Post("register")
  @ApiOperation({
    summary: 'Register a new user',
    description: 'This endpoint registers a new user into the system.',
  })
  @ApiBody({
    description: 'Request body to register a new user',
    type: RegisterDto,
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string', example: 'jwt.token.here' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'User Name' },
            email: { type: 'string', example: 'user@example.com' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid email or password',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Invalid email or password' },
      },
    },
  })
  async register(@Body() body, @Res() res: Response) {
    let data = await this.service.register(body);
    res.status(HttpStatus.OK).json(data);
  }






  @Post()
  @ApiOperation({ summary: "Create a new user" })
  @ApiBody({ type: CreateCustomerDto })
  async createUser(@Body() body: CreateCustomerDto, @Res() res: Response) {
    // const user = await this.service.createUser(body);
    res.status(HttpStatus.CREATED).json({ message: "User created" });
  }

  @Get("getAllUsers")
  @ApiOperation({ summary: "Get all users" })
  async getAllUsers(@Res() res: Response) {
    const users = await this.service.getAllUsers();
    res.status(HttpStatus.OK).json(users);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get user by ID" })
  @ApiParam({ name: "id", type: Number })
  async getUserById(@Param("id") id: number, @Res() res: Response) {
   const result = await this.service.getUserById(id);
    res.status(HttpStatus.OK).json(result);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update a user" })
  @ApiParam({ name: "id", type: Number })
  @ApiBody({ type: UpdateCustomerDto })
  async updateUser(
    @Param("id") id: number,
    @Body() body: UpdateCustomerDto,
    @Res() res: Response,
  ) {
    // const updatedUser = await this.service.updateUser(id, body);
    res.status(HttpStatus.OK).json({ message: `User with id ${id} updated` });
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a user" })
  @ApiParam({ name: "id", type: Number })
  async deleteUser(@Param("id") id: number, @Res() res: Response) {
    // await this.service.deleteUser(id);
    res.status(HttpStatus.OK).json({ message: `User with id ${id} deleted` });
  }
}
