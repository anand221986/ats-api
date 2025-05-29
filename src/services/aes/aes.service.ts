import { Injectable } from "@nestjs/common";
import { UtilService } from "../../util/util.service";
import { DbService } from "../../db/db.service";
import * as CryptoJS from "crypto-js";

@Injectable()
export class AesService {


  constructor(
    private utilService: UtilService,
    private dbService: DbService
  ) {

  }

  encrypt(plainText, key) {
    return CryptoJS.AES.encrypt(plainText, key).toString();
  }

  decrypt(data, key) {
    try {
      const bytes = CryptoJS.AES.decrypt(data, key);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (e) {
      return null;
    }
  }

  decryptPost(data) {
    // console.log("payload:",data.payload_data);

    if (data.hasOwnProperty("payload_data")) {
      // console.log("decrpted data:", this.decrypt(data.payload_data, this.utilService.KEY));
      return this.decrypt(data.payload_data, this.utilService.KEY);
    } else {
      return null;
    }
  }

}
