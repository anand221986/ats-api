import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { DbService } from "../db/db.service";
import { UtilService } from "../util/util.service";
import { AuthService } from "../auth/auth.service"
const bcrypt = require("bcryptjs");
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    public dbService: DbService,
    public utilService: UtilService,
    @Inject(forwardRef(() => AuthService)) public AuthService: AuthService
  ) {
  }
//get All userlist from the table 
async getAllUsers()  {
  const query = `SELECT * FROM "user" ORDER BY id ASC;`;
  const result = await this.dbService.execute(query);
   return this.utilService.successResponse(result, "User list retrieved successfully.");
 //return users;
}
async getUserById(id: number): Promise<any> {
  const query = `SELECT * FROM "user" WHERE id='${id}'`;
  const result = await this.dbService.execute(query);
    return this.utilService.successResponse(result[0],"User details retrieved successfully.");
 
}
async deleteUserById(id: number) {
  const query = `DELETE FROM "user" WHERE id='${id}' RETURNING *;`;
  const result = await this.dbService.execute(query);
  if (result.length === 0) {
    return this.utilService.failResponse(null, "User not found or already deleted.");
  }
  return this.utilService.successResponse(result[0], "User deleted successfully.");
}
  async checkAdminUser(email, password) {
    let users: any = await this.dbService.execute("SELECT id,name,email,password,created_DT FROM admin WHERE email='" + email + "' AND password='" + password + "'");
    if (users.length > 0) {
      return users[0];
    } else {
      return null;
    }
  }

 

  async getAllSalesEmployees() {
    const query = `SELECT id, first_name, last_name, email, mobile, gender, profile_img, profile, dob, designation, department, reporting_manager, status, password, created_at, updated_at FROM users WHERE department = 'Sales' and status = 1`
    const list = await this.dbService.execute(query);
    if (list.length > 0) {
      return this.utilService.successResponse(list, "Sales Employees found");
    } else {
      return this.utilService.failResponse("No Sales Employees Found")
    }
  }

  async registerGoogleAuth(profile: any) {
    const { id: googleId, emails, displayName, photos } = profile;
    const email = emails[0].value;
    
    const nameParts = displayName.split(' ');
    const lastName = nameParts.slice(1).join(' ');

    let existingUser = await this.dbService.execute(
      `SELECT * FROM users WHERE email='${email}'`
    );
    if(existingUser.length === 0) {
      return this.utilService.failResponse("No such user exists");
    }
    if (existingUser.length > 0) {
      if (!existingUser[0].google_id) {
        await this.dbService.execute(
          `ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255)`
        );
        await this.dbService.execute(
          `UPDATE users SET google_id='${googleId}' WHERE id=${existingUser[0].id}`
        );
        return existingUser[0];
      }
      return {
        id: existingUser[0].insertId,
        last_name: lastName,
        email,
        google_id: googleId,
        type: existingUser[0].department,
        designation: existingUser[0].designation
      };
    }
  }
}

interface Booking {
  type: string;
  itenary?: any;
  flight?: any;
  created_DT: string;
}

interface Itenary {
  title: string;
  travel_city_name: string;
  days_count: number;
  city_count: number;
  hotel_count: number;
  flight_count: number;
  activity_count: number;
  visa_count: number;
  transfer_count: number;
  insurance_count: number;
  package_ib_id: number;
  uuid: string;
  start_date: string;
}
