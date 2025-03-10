// src/cart/interface/cart.interface.ts
import { Document } from 'mongoose';

export interface ICartItem {
  productId: string;
  quantity: number;
  variantId?: string;
  price: number;
}

export interface ICart extends Document {
  _id: string;
  userId: string;
  items: ICartItem[];
  updatedAt: Date;
  createdAt: Date;
}
