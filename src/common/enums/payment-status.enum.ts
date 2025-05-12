import { registerEnumType } from '@nestjs/graphql';

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
  description: 'The different statuses a payment can have',
});
