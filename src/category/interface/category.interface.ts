// src/category/interface/category.interface.ts
import { Document } from 'mongoose';

export interface ICategory extends Document {
  _id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface CategoryTree extends Omit<ICategory, 'toObject' | 'save'> {
  children: CategoryTree[];
}
