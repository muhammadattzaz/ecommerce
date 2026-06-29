import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class MockPaymentService {
  // Simulates a payment gateway — always succeeds in dev
  async charge(amountPence: number): Promise<{ success: boolean; reference: string }> {
    await new Promise((resolve) => setTimeout(resolve, 50)); // simulate latency
    return { success: true, reference: `PAY-${randomUUID().slice(0, 8).toUpperCase()}` };
  }
}
