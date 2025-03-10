import { Document } from 'mongoose';
import { ProductAttribute, ProductVariant } from '../entities/product.entity';

export interface IProduct extends Document {
  readonly _id: string;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly salePrice?: number;
  readonly categoryIds: string[];
  readonly imageUrls: string[];
  readonly averageRating: number;
  readonly reviewCount: number;
  readonly stock: number;
  readonly sku: string;
  readonly brand?: string;
  readonly isActive: boolean;
  readonly attributes?: ProductAttribute[];
  readonly variants?: ProductVariant[];
  readonly isFeatured: boolean;
  readonly weight: number;
  readonly unit?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly taxRate?: number;
  readonly minOrderQuantity?: number;
}
