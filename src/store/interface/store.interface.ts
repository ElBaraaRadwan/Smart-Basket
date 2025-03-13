import { Document } from 'mongoose';

export interface StoreInterface extends Document {
  readonly name: string;
  readonly description: string;
  readonly logoUrl: string;
  readonly bannerUrl?: string;
  readonly cuisineTypes: string[];
  readonly averageRating: number;
  readonly totalReviews: number;
  readonly deliveryFee: number;
  readonly minOrderAmount: number;
  readonly avgPrepTime: number;
  readonly commissionRate: number;
  readonly isFeatured: boolean;
  readonly isActive: boolean;
  readonly workingHours: WorkingHours[];
  readonly deliveryZones: DeliveryZone[];
  readonly ownerId: string;
  readonly tags?: string[];
  readonly contactPhone?: string;
  readonly contactEmail?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

interface WorkingHours {
  day: string;
  open: string;
  close: string;
}

interface DeliveryZone {
  areaName: string;
  zipCodes: string[];
}
