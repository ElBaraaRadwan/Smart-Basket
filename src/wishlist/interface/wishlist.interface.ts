import { Document } from 'mongoose';

export interface IWishlist extends Document {
  _id: string;
  userId: string;
  productIds: string[];
  updatedAt: Date;
  createdAt: Date;
}
