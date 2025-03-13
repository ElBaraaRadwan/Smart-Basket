import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Field, ObjectType, ID, Float, Int } from '@nestjs/graphql';

@ObjectType()
@Schema({ timestamps: true })
export class Store {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true })
  description: string;

  @Field()
  @Prop({ required: true })
  logoUrl: string;

  @Field({ nullable: true })
  @Prop()
  bannerUrl?: string;

  @Field(() => [String])
  @Prop({ type: [String], required: true })
  cuisineTypes: string[];

  @Field(() => Float)
  @Prop({ required: true, default: 0 })
  averageRating: number;

  @Field(() => Int)
  @Prop({ required: true, default: 0 })
  totalReviews: number;

  @Field(() => Float)
  @Prop({ required: true, min: 0 })
  deliveryFee: number;

  @Field(() => Int)
  @Prop({ required: true, min: 0 })
  minOrderAmount: number;

  @Field(() => Int)
  @Prop({ required: true, min: 10, max: 120 })
  avgPrepTime: number; // in minutes

  @Field(() => Float)
  @Prop({ required: true, min: 0, max: 50 })
  commissionRate: number; // percentage

  @Field(() => Boolean)
  @Prop({ default: false })
  isFeatured: boolean;

  @Field(() => Boolean)
  @Prop({ default: true })
  isActive: boolean;

  @Field(() => [WorkingHours])
  @Prop({
    type: [{ day: String, open: String, close: String }],
    required: true,
  })
  workingHours: WorkingHours[];

  @Field(() => [DeliveryZone])
  @Prop({ type: [{ areaName: String, zipCodes: [String] }], required: true })
  deliveryZones: DeliveryZone[];

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  managerId: string;

  @Field(() => [String], { nullable: true })
  @Prop({ type: [String] })
  tags?: string[];

  @Field(() => String, { nullable: true })
  @Prop()
  contactPhone?: string;

  @Field(() => String, { nullable: true })
  @Prop()
  contactEmail?: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
class WorkingHours {
  @Field()
  day: string;

  @Field()
  open: string;

  @Field()
  close: string;
}

@ObjectType()
class DeliveryZone {
  @Field()
  areaName: string;

  @Field(() => [String])
  zipCodes: string[];
}

export type StoreDocument = Store & Document;
export const StoreSchema = SchemaFactory.createForClass(Store);
