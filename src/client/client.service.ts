// jobs.service.ts
import { Injectable,NotFoundException } from '@nestjs/common';
import { CreateClientDto ,UpdateClientDto} from './client.service.dto';
import { DbService } from "../db/db.service";
import { UtilService } from "../util/util.service";

@Injectable()
export class ClientService {
  private jobs: any[] = [];
    constructor(
      public dbService: DbService,
    public utilService: UtilService,
    ) {
    }
 async createClient(dto: CreateClientDto) {
  try {
    const toPgArray = (arr: string[]) => `{${arr.map(val => `"${val}"`).join(',')}}`;
const setData = [
  { set: 'name', value: String(dto.name ?? '') },
  { set: 'website', value: String(dto.website ?? '') },
  { set: 'careers_page', value: String(dto.careersPage ?? '') },
  { set: 'street1', value: String(dto.street1 ?? '') },
  { set: 'street2', value: String(dto.street2 ?? '') },
  { set: 'city', value: String(dto.city ?? '') },
  { set: 'state', value: String(dto.state ?? '') },
  { set: 'country', value: String(dto.country ?? '') },
  { set: 'zipcode', value: String(dto.zipcode ?? '') },
  { set: 'linkedin', value: String(dto.linkedin ?? '') },
  { set: 'phone', value: String(dto.phone ?? '') },
   { set: 'tags', value: toPgArray(dto.tags ?? []) }
];
    const insertion = await this.dbService.insertData('client', setData);
    return this.utilService.successResponse(insertion, 'Client created successfully.');
  } catch (error) {
    console.error('Create client Error:', error);
    throw new Error('Failed to create client. Please ensure all fields are valid and meet constraints.');
  }
}

  async getAllClient() 
  {
  const query = `SELECT * FROM "client" ORDER BY id ASC;`;
  const result = await this.dbService.execute(query);
  return this.utilService.successResponse(result, "Client list retrieved successfully.");
  }

  async getClientId(id: number){
  const query = `SELECT * FROM client WHERE id = ${id}`;
  const result = await this.dbService.execute(query);
  if (!result.length) {
    throw new NotFoundException(`Client with ID ${id} not found`);
  }
  return this.utilService.successResponse(result, "Client  retrieved successfully.");
}

  async updateClient(id: number, dto: UpdateClientDto) {
    const index = this.jobs.findIndex((job) => job.id === id);
    if (index !== -1) {
      this.jobs[index] = { ...this.jobs[index], ...dto };
      return this.jobs[index];
    }
    return null;
  }

  async deleteCandidate(id: number) {
    const index = this.jobs.findIndex((job) => job.id === id);
    if (index !== -1) {
      const removed = this.jobs.splice(index, 1);
      return removed[0];
    }
    return null;
  }


 
}
