import { Document } from 'mongoose';
import { OrderStatus, PaymentStatus } from '../../common/enums';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  variantName?: string;
  variantId?: string;
  imageUrl?: string;
}

interface PaymentInfo {
  method: string;
  status: PaymentStatus;
  transactionId?: string;
}

interface ShippingInfo {
  address: string;
  trackingNumber?: string;
  cost: number;
}

export interface OrderInterface extends Document {
  readonly _id: string;
  readonly orderNumber: string;
  readonly userId: string;
  readonly items: OrderItem[];
  readonly subtotal: number;
  readonly tax: number;
  readonly total: number;
  readonly status: OrderStatus;
  readonly payment: PaymentInfo;
  readonly shipping: ShippingInfo;
  readonly addressId?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deliveredAt?: Date;
}
