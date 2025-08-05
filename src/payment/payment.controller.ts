// payment.controller.ts
import {
  Controller,
  Post,
  Req,
  Res,
  HttpStatus,
  ForbiddenException,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PaymentService } from './payment.service';
import * as crypto from 'crypto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/webhook')
  async handleWebhook(@Req() req: Request, @Res() res: Response, @Headers() headers) {
    const signature = headers['x-razorpay-signature'];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const body = JSON.stringify(req.body);
    // const expectedSignature = crypto
    //   .createHmac('sha256', secret)
    //   .update(body)
    //   .digest('hex');

    // if (signature !== expectedSignature) {
    //   throw new ForbiddenException('Invalid Razorpay signature');
    // }

    const event = req.body;

    if (event.event === 'payment.captured') {
      const paymentData = event.payload.payment.entity;
    //   await this.paymentService.saveTransaction(paymentData);
    //   await this.paymentService.sendConfirmation(paymentData);
    }

    return res.status(HttpStatus.OK).json({ received: true });
  }
}
