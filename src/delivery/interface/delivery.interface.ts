import { Document } from 'mongoose';

export interface DeliveryLocationInterface {
  latitude: number;
  longitude: number;
  address: string;
}

export interface DeliveryStatusInterface {
  status: string;
  timestamp: Date;
  note?: string;
}

export interface DeliveryInterface extends Document {
  readonly orderId: string;
  readonly driverId?: string;
  readonly pickupLocation: DeliveryLocationInterface;
  readonly dropoffLocation: DeliveryLocationInterface;
  readonly statusHistory: DeliveryStatusInterface[];
  readonly status: string;
  readonly estimatedDeliveryTime?: number;
  readonly actualDeliveryTime?: number;
  readonly currentLocation?: DeliveryLocationInterface;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly isCompleted: boolean;
  readonly isCancelled: boolean;
  readonly cancellationReason?: string;
  readonly distance?: number;
  readonly storeId?: string;
}
