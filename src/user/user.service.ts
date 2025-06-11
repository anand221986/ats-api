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

  async loginAdmin(req) {
    let email = req.email;
    let password = req.password;
    let adminUser = await this.checkAdminUser(email, password);
    if (adminUser != null) {
      const token = this.AuthService.getToken(adminUser.id, adminUser.email);
      let result: any = {
        type: "admin",
        user: adminUser,
        token
      };
      return this.utilService.successResponse(result, "Admin found");
    }
    if (adminUser != null) {
      const token = this.AuthService.getToken(adminUser.id, adminUser.email);
      let result: any = {
        type: adminUser.department,
        user: adminUser,
        token
      };
      let query = `UPDATE users SET token='${token}' WHERE id=${adminUser.id}`;
      const execution = await this.dbService.execute(query);
      return this.utilService.successResponse(result, `Welcome ${adminUser.first_name} ${adminUser.last_name}`);
    }
    return this.utilService.failResponse("Invalid credentials");
  }

  async register(req) {
    try {
      // Check if email already exists
      let userEmail = await this.getUserByEmail(req.email);
      if (userEmail != null) {
        return this.utilService.failResponse("Email already exists");
      }

      // Check if phone number already exists
      let userPhone = await this.getUserByPhone(req.phone);
      if (userPhone != null) {
        return this.utilService.failResponse("Phone number already exists");
      }

      // Hash the password
      let hashPass = await bcrypt.hash(req.password, 12);

      // Prepare insert data
      let setData: { set: string; value: any }[] = [];
      setData.push(this.utilService.getInsertObj("first_name", req.first_name));
      setData.push(this.utilService.getInsertObj("last_name", req.last_name));
      setData.push(this.utilService.getInsertObj("email", req.email));
      setData.push(this.utilService.getInsertObj("phone", req.phone));
      setData.push(this.utilService.getInsertObj("password", hashPass));
      setData.push(this.utilService.getInsertObj("created_dt", this.utilService.getMomentDT())); // fixed typo here

      // Insert into DB
      const insertedUser = await this.dbService.insertData("users", setData);
      console.log(insertedUser, 'full insertion object');

      if (insertedUser) {
        // const user = await this.getUserById(insertedUser);
        // const token = this.AuthService.getToken(user.id, user.email);
        // user.token = token;

        return this.utilService.successResponse(insertedUser, "User registered successfully");
      } else {
        return this.utilService.failResponse("User registration failed. Please try again.");
      }

    } catch (error) {
      console.error("Registration Error:", error);
      return this.utilService.failResponse("Something went wrong during registration. Please try again.");
    }
  }

  async getUserByEmail(email) {
    let query = "SELECT  * FROM users WHERE email='" + email + "'";

    console.log(query)
    let list: any = await this.dbService.execute(query);
    if (list.length > 0) {
      return list[0];
    } else {
      return null;
    }
  }
  async getUserByPhone(phone) {
    let query = "SELECT * FROM users WHERE phone='" + phone + "'";
    let list: any = await this.dbService.execute(query);
    if (list.length > 0) {
      return list[0];
    } else {
      return null;
    }
  }

  //get All userlist from the table 
  async getAllUsers() {
    const query = `SELECT * FROM "users" ORDER BY id ASC;`;
    const result = await this.dbService.execute(query);
    return this.utilService.successResponse(result, "User list retrieved successfully.");
    //return users;
  }
  async getUserById(id: number): Promise<any> {
    const query = `SELECT * FROM "users" WHERE id='${id}'`;
    const result = await this.dbService.execute(query);
    return this.utilService.successResponse(result[0], "User details retrieved successfully.");

  }
  async deleteUserById(id: number) {
    const query = `DELETE FROM "users" WHERE id='${id}' RETURNING *;`;
    const result = await this.dbService.execute(query);
    if (result.length === 0) {
      return this.utilService.failResponse(null, "User not found or already deleted.");
    }
    return this.utilService.successResponse(result[0], "User deleted successfully.");
  }
  async checkAdminUser(email: string, password: string) {
    try {
      // Only query by email
      const users: any[] = await this.dbService.execute(
        `SELECT * FROM users WHERE email = '${email}'`,
      );
      if (users.length === 0) {
        return null; // User not found
      }
      const user = users[0];
      // Compare input password with hashed password from DB
      const passMatch = await bcrypt.compare(password, user.password);
      if (!passMatch) {
        return null; // Password doesn't match
      }
      // Optionally remove password before returning
      delete user.password;

      return user;

    } catch (error) {
      console.error("Admin Login Error:", error);
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
    if (existingUser.length === 0) {
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
