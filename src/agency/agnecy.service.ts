import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { DbService } from "../db/db.service";
import { UtilService } from "../util/util.service";
import { AuthService } from "../auth/auth.service"
const bcrypt = require("bcryptjs");
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AgencyService {
  constructor(
    public dbService: DbService,
    public utilService: UtilService,
    @Inject(forwardRef(() => AuthService)) public AuthService: AuthService
  ) {
  }
  //get All userlist from the table 
  async getAllAgencies() {
    const query = `SELECT * FROM "agency" ORDER BY id Desc;`;
    const result = await this.dbService.execute(query);
    return this.utilService.successResponse(result, "agency list retrieved successfully.");
    //return users;
  }
  // /agency/id


   
}
