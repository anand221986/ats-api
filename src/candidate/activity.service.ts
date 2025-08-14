// jobs.service.ts
import { Injectable, NotFoundException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { DbService } from "../db/db.service";
import { UtilService } from "../util/util.service";
@Injectable()
export class ActivityService {
    constructor(
        public dbService: DbService,
        public utilService: UtilService,
    ) {
    }
    async logActivity(candidateId: number, recruiterId: number, type: string, details: any) {
        const setData = [
            { set: 'candidate_id', value: candidateId },
            { set: 'recruiter_id', value: recruiterId },
            { set: 'activity_type', value: type },
            { set: 'activity_details', value: details },
        ]
        const insertion = await this.dbService.insertData('candidate_activities', setData);
        return this.utilService.successResponse('Activity Logged successfully.');
    }
    async getCandidateActivities(candidateId: number) {
        const query = `SELECT * FROM candidate_activities WHERE candidate_id =${candidateId} ORDER BY created_at DESC`;
        return await this.dbService.execute(query);
    }
}