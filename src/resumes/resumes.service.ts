import { Injectable, NotFoundException  } from '@nestjs/common';
import { DbService } from "../db/db.service";
import { UtilService } from "../util/util.service";

@Injectable()
export class ResumesService {
      constructor(
    public dbService: DbService,
    public utilService: UtilService,
  ) {
  }
  async getResumesByUser(id) {
        const query = `SELECT * FROM candidate_resumes WHERE candidate_id = ${id}`;
        const result = await this.dbService.execute(query);
        if (!result.length) {
          throw new NotFoundException(`No Resumes for this candidates with ID ${id} not found`);
        }
        return this.utilService.successResponse(result, "Candidates resumes list  retrieved successfully.");
  }
}