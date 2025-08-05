// payment.service.ts
import { Injectable, NotFoundException,HttpException,HttpStatus } from '@nestjs/common';
import Razorpay = require('razorpay');

@Injectable()
export class PaymentService {
  private razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });
  }

  async createOrder(amount: number, currency = 'INR') {
    const options = {
      amount: amount * 100, // in paise
      currency,
      receipt: `receipt_${Date.now()}`,
    };
    return await this.razorpay.orders.create(options);
  }
}
