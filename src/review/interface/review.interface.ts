import { Document } from 'mongoose';

export interface ReviewInterface extends Document {
  readonly productId: string;
  readonly userId: string;
  readonly rating: number;
  readonly title: string;
  readonly comment: string;
  readonly imageUrls?: string[];
  readonly createdAt: Date;
  readonly isVisible: boolean;
  readonly orderId?: string;
}
