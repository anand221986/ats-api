// jobs.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from "../db/db.service";
import { UtilService } from "../util/util.service";
import { PythonShell } from 'python-shell';
import * as fs from 'fs';
import * as pdfParse from 'pdf-parse';
import * as path from 'path';
import { spawn } from 'child_process';
import {AddCandidateDto,AddEmployerDto,AddProspectDto}  from  "./common.dto"
@Injectable()
export class CommonService {
  private jobs: any[] = [];
  constructor(
    public dbService: DbService,
    public utilService: UtilService,
  ) {
  }


  async getDashboardStats() {
    const query = `
    SELECT 
      (SELECT COUNT(*) FROM client ) AS active_clients,
      (SELECT COUNT(*) FROM jobs ) AS active_jobs,
      (SELECT COUNT(*) FROM candidates) AS total_candidates;
  `;
    const result = await this.dbService.execute(query);
    const row = result[0]; // We expect a single row result

    const response = [
      {
        title: "Active Clients",
        value: row.active_clients,
        change: "+2 new this month", // optionally make this dynamic
        icon: "Building2",
        trend: "up" as const,
      },
      {
        title: "Active Jobs",
        value: row.active_jobs,
        change: "+12% from last month",
        icon: "Briefcase",
        trend: "up" as const,
      },
      {
        title: "Total Candidates",
        value: row.total_candidates,
        change: "+5% from last month",
        icon: "Users",
        trend: "up" as const,
      },
      {
        title: "Placement Rate",
        value: "23%",
        change: "+3% from last quarter",
        icon: "TrendingUp",
        trend: "up" as const,
      },
    ];

    return this.utilService.successResponse(response, "Dashboard stats retrieved successfully.");
  }

  async storeLead(leadData: any): Promise<any> {
    try {
      const setData = [
        { set: 'name', value: String(leadData.name) },
        { set: 'email', value: String(leadData.email) },
        { set: 'subject', value: String(leadData.subject) },
        { set: 'phone', value: String(leadData.phone ?? '') },
        { set: 'message', value: String(leadData.message) },
        { set: 'company', value: String(leadData.company) },
        { set: 'created_at', value: new Date().toISOString() },
      ];

      const insertion = await this.dbService.insertData('contact_forms', setData);

      return this.utilService.successResponse(insertion, 'Thank you for contacting us!'
      );
    } catch (error) {
      throw new Error('Failed to submit your inquiry.');
    }
  }

  async addUserSkill(UserSkill: any): Promise<any> {
    try {
      const setData = [
        { set: 'skill', value: String(UserSkill.skill) },
        { set: 'created_at', value: new Date().toISOString() },
      ];
      const insertion = await this.dbService.insertData('user_skills', setData);
      return this.utilService.successResponse(insertion, 'Skill Add Successfully.'
      );
    } catch (error) {
      throw new Error('Failed to submit your inquiry.');
    }
  }

  async getUserSkills() {
    const query = `SELECT * FROM user_skills`;
    const result = await this.dbService.execute(query);
    // if (!result.length) {
    //   throw new NotFoundException(`user skills not found `);
    // }
    return this.utilService.successResponse(result, "Job Skills retrieved successfully.");
  }

  

   async addcandidate(UserSkill: any): Promise<any> {
    try {
      const setData = [
        { set: 'skill', value: String(UserSkill.skill) },
        { set: 'created_at', value: new Date().toISOString() },
      ];
      const insertion = await this.dbService.insertData('user_skills', setData);
      return this.utilService.successResponse(insertion, 'Skill Add Successfully.'
      );
    } catch (error) {
      throw new Error('Failed to submit your inquiry.');
    }
  }

  


   async addEmployer(UserSkill: any): Promise<any> {
    try {
      const setData = [
        { set: 'skill', value: String(UserSkill.skill) },
        { set: 'created_at', value: new Date().toISOString() },
      ];
      const insertion = await this.dbService.insertData('user_skills', setData);
      return this.utilService.successResponse(insertion, 'Skill Add Successfully.'
      );
    } catch (error) {
      throw new Error('Failed to submit your inquiry.');
    }
  }


async addProspect(dto: AddProspectDto) {
    // 1. Save to database
const setData = [
  { set: 'full_name', value: dto.fullName },
  { set: 'company_name', value: dto.companyName },
  { set: 'email', value: dto.email },
  { set: 'phone_number', value: dto.phoneNumber || null },
  { set: 'role_to_fill', value: dto.roleToFill || null },
  { set: 'job_type', value: dto.jobType || null },
  { set: 'message', value: dto.message || null },
  { set: 'client_type', value: 'prospect' },
  { set: 'created_dt', value: new Date().toISOString() },
];
  const inserted = await this.dbService.insertData('client', setData);

    // // 2. Send email to A1 selectors
    // await this.mailService.sendMail({
    //   to: 'a1selectors@example.com',
    //   subject: `New Prospect: ${dto.companyName}`,
    //   text: `${dto.companyName} just filled the prospect form.\nEmail: ${dto.email}\nPhone: ${dto.phone || '-'}`,
    // });

    // // 3. Send confirmation email to company
    // await this.mailService.sendMail({
    //   to: dto.email,
    //   subject: 'Thank you for reaching out',
    //   text: `Hi ${dto.companyName},\n\nThank you for filling the form. We will reach out to you shortly.`,
    // });

    return { success: true, message: 'Prospect added and emails sent.' };
  }




}
