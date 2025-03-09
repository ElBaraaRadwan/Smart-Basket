import { Document } from 'mongoose';
import { UserRole } from '../entities/user-entity';

export interface IUser extends Document {
  readonly _id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
  readonly phoneNumber: string;
  readonly roles: UserRole[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly isEmailVerified: boolean;
  readonly avatarUrl?: string;
  readonly favoriteCategories?: string[];
}
