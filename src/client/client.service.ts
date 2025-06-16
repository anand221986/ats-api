// jobs.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto, UpdateClientDto } from './client.service.dto';
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
                { set: 'tags', value: toPgArray(dto.tags ?? []) },
                { set: 'industry', value: String(dto.industry ?? '') },
                { set: 'email', value: String(dto.email?? '') },
                { set: 'contact_person', value: String(dto.contactPerson ?? '') },
                
            ];
            const insertion = await this.dbService.insertData('client', setData);
            return this.utilService.successResponse(insertion, 'Client created successfully.');
        } catch (error) {
            console.error('Create client Error:', error);
            throw new Error('Failed to create client. Please ensure all fields are valid and meet constraints.');
        }
    }

    async getAllClient() {
        const query = `SELECT * FROM "client" ORDER BY id ASC;`;
        const result = await this.dbService.execute(query);
        return this.utilService.successResponse(result, "Client list retrieved successfully.");
    }

    async getClientId(id: number) {
        const query = `SELECT * FROM client WHERE id = ${id}`;
        const result = await this.dbService.execute(query);
        if (!result.length) {
            throw new NotFoundException(`Client with ID ${id} not found`);
        }
        return this.utilService.successResponse(result, "Client  retrieved successfully.");
    }

    async updateClient(id: number, dto: UpdateClientDto) {
        try {
            // Convert DTO to key=value pairs for update
            const set = Object.entries(dto).map(([key, value]) => `${key}='${value}'`);
            const where = [`id=${id}`];
            const updateResult = await this.dbService.updateData('client', set, where);
            if (updateResult.affectedRows === 0) {
                return this.utilService.failResponse('Client not found or no changes made.');
            }
            return this.utilService.successResponse(updateResult, 'Client updated successfully.');
        } catch (error) {
            console.error('Error updating client:', error);
            return this.utilService.failResponse('Failed to update client.');
        }
    }

    async deleteClientById(id: number) {
        try {
            const query = `DELETE FROM "client" WHERE id='${id}' RETURNING *;`;
            const result = await this.dbService.execute(query);
            if (result.length === 0) {
                return this.utilService.failResponse(null, "User not found or already deleted.");
            }
            return this.utilService.successResponse(result[0], "User deleted successfully.");

        }
        catch (error) {

            console.error('Delete client Error:', error);
            throw new Error(error);
        }
    }
}
