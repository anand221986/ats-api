import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import { DbService } from "../db/db.service";

@Injectable()
export class WhatsappService {
  private client: Twilio;

  constructor(public dbService: DbService,) {
    this.client = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

 async sendWhatsAppMessage(candidateId: number, to: string, message: string) {
  // 1. Insert into DB as outgoing/queued
  // const storedMsg = await this.dbService.insertData('whatsapp_messages', [
  //   { set: 'candidate_id', value: candidateId },
  //   { set: 'direction', value: 'outgoing' },
  //   { set: 'message', value:message },
  //   { set: 'to_number', value: to },
  //   { set: 'status', value: 'queued' },
  // ]);

  try {
    // 2. Call Twilio
    const result = await this.client.messages.create({
      body: message,
      from: 'whatsapp:+14155238886',
      to: `whatsapp:${to}`,
    });

    // 3. Update status to sent
    // await this.dbService.execute(
    //   'UPDATE whatsapp_messages SET status=$1, sent_at=NOW() WHERE id=$2',
    //   ['sent', storedMsg.id]
    // );

    return result;
  } catch (err) {
    // 4. In case of failure mark as failed
    // await this.dbService.execute(
    //   'UPDATE whatsapp_messages SET status=$1 WHERE id=$2',
    //   ['failed', storedMsg.id]
    // );
    throw err;
  }
}

}
