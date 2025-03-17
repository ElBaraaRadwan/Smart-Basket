import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Field, ObjectType, ID, Float } from '@nestjs/graphql';

@ObjectType()
@Schema({ timestamps: true })
export class DeliveryLocation {
  @Field(() => Float)
  @Prop({ required: true })
  latitude: number;

  @Field(() => Float)
  @Prop({ required: true })
  longitude: number;

  @Field()
  @Prop({ required: true })
  address: string;
}

@ObjectType()
@Schema({ timestamps: true })
export class DeliveryStatus {
  @Field()
  @Prop({ required: true })
  status: string;

  @Field(() => Date)
  @Prop({ required: true, default: Date.now })
  timestamp: Date;

  @Field({ nullable: true })
  @Prop()
  note?: string;
}

@ObjectType()
@Schema({ timestamps: true })
export class Delivery {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Order', required: true })
  orderId: string;

  @Field(() => ID, { nullable: true })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  driverId?: string;

  @Field(() => DeliveryLocation)
  @Prop({ type: Object, required: true })
  pickupLocation: DeliveryLocation;

  @Field(() => DeliveryLocation)
  @Prop({ type: Object, required: true })
  dropoffLocation: DeliveryLocation;

  @Field(() => [DeliveryStatus])
  @Prop([{ type: Object }])
  statusHistory: DeliveryStatus[];

  @Field()
  @Prop({ required: true, default: 'pending' })
  status: string;

  @Field(() => Float, { nullable: true })
  @Prop()
  estimatedDeliveryTime?: number;

  @Field(() => Float, { nullable: true })
  @Prop()
  actualDeliveryTime?: number;

  @Field(() => DeliveryLocation, { nullable: true })
  @Prop({ type: Object })
  currentLocation?: DeliveryLocation;

  @Field(() => Date)
  @Prop({ default: Date.now })
  createdAt: Date;

  @Field(() => Date)
  @Prop({ default: Date.now })
  updatedAt: Date;

  @Field(() => Boolean)
  @Prop({ default: false })
  isCompleted: boolean;

  @Field(() => Boolean)
  @Prop({ default: false })
  isCancelled: boolean;

  @Field(() => String, { nullable: true })
  @Prop()
  cancellationReason?: string;

  @Field(() => Float, { nullable: true })
  @Prop()
  distance?: number;

  @Field(() => ID, { nullable: true })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Store' })
  storeId?: string;
}

export type DeliveryDocument = Delivery & Document;
export const DeliverySchema = SchemaFactory.createForClass(Delivery);
