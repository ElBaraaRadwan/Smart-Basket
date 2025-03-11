import { Document } from 'mongoose';

export interface AddressInterface extends Document {
  readonly _id: string;
  readonly street: string;
  readonly city: string;
  readonly state: string;
  readonly zipCode: string;
  readonly apartment?: string;
  readonly userId: string;
  readonly isDefault: boolean;
  readonly label?: string;
  readonly coordinates: number[];
}
