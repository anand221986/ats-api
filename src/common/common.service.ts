// jobs.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from "../db/db.service";
import { UtilService } from "../util/util.service";
import { PythonShell } from 'python-shell';
import * as fs from 'fs';
import * as pdfParse from 'pdf-parse';
import * as path from 'path';
import { spawn } from 'child_process';
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
      { set: 'created_at', value: new Date().toISOString() },
    ];

    const insertion = await this.dbService.insertData('leads', setData);
    
    return this.utilService.successResponse(insertion ,'Thank you for contacting us!'
    );
  } catch (error) {
    throw new Error('Failed to submit your inquiry.');
  }
}

}
