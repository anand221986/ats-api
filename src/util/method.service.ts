import { Injectable } from "@nestjs/common";
import * as moment from "moment";
import axios from "axios";
import { UtilService } from "src/util/util.service";
import { DbService } from "../db/db.service";
import { TruncateNumberPipe } from "src/truncate-number/truncate-number.pipe";

@Injectable()
export class MethodService {

  constructor(
    private utilService: UtilService,
    private dbService: DbService,
    private truncateNumber: TruncateNumberPipe
  ) {

  }
 
}
