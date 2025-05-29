import { Injectable } from "@nestjs/common";
import { UtilService } from "src/util/util.service";
import { createClient } from "redis";
import { DbService } from "src/db/db.service";

@Injectable()
export class RedisService {

  client;

  constructor(
    private utilService: UtilService,
    private dbService: DbService
  ) {

  }

  async connectRedis() {
    if (!this.utilService.checkValue(this.client)) {
      this.client = createClient();
      this.client.on("error", err => console.log("Redis Client Error", err));
      await this.client.connect();
    }
  }

  async storeValue(key, value) {
    if (!this.utilService.checkValue(this.client)) {
      this.connectRedis();
    }

    await this.client.set(key, value);
  }

  async getValue(key) {
    if (!this.utilService.checkValue(this.client)) {
      this.connectRedis();
    }
    return await this.client.get(key);
  }

  async clearRedisByKey(key) {
    if (!this.utilService.checkValue(this.client)) {
      this.connectRedis();
    }

    await this.client.set(key, "");
  }

 
}
