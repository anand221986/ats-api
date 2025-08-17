import { Controller, Post, Body } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post('send')
  async sendMessage(
    @Body('to') to: string,
    @Body('message') message: string,
  ) {
    return await this.whatsappService.sendWhatsAppMessage(0,to, message);
  }
}
