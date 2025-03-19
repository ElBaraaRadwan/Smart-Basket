import { Document } from 'mongoose';
import { PaymentStatus } from '../../common/enums';

export interface PaymentInterface extends Document {
  readonly _id: string;
  readonly orderId: string;
  readonly userId: string;
  readonly method: string;
  readonly amount: number;
  readonly status: PaymentStatus;
  readonly transactionId?: string;
  readonly paymentIntentId?: string;
  readonly receiptUrl?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly paidAt?: Date;
  readonly failureMessage?: string;
}
