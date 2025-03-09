import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum ActivityType {
  VIEW_PRODUCT = 'view_product',
  ADD_TO_CART = 'add_to_cart',
  PURCHASE = 'purchase',
  SEARCH = 'search',
  CATEGORY_VIEW = 'category_view',
  PRODUCT_RECOMMENDATION_CLICK = 'product_recommendation_click'
}

@Schema({ timestamps: true })
export class UserActivity {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ enum: Object.values(ActivityType), required: true })
  type: ActivityType;

  @Prop({ type: MongooseSchema.Types.Mixed })
  data: any;

  @Prop()
  createdAt: Date;
}

export type UserActivityDocument = UserActivity & Document;
export const UserActivitySchema = SchemaFactory.createForClass(UserActivity);
