import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import {
  Field,
  ObjectType,
  ID,
  Int,
  Float,
  GraphQLISODateTime,
} from '@nestjs/graphql';
import { OrderStatus, PaymentStatus } from '../../common/enums';

@ObjectType()
class OrderItem {
  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
  productId: string;

  @Field()
  @Prop({ required: true })
  productName: string;

  @Field(() => Int)
  @Prop({ required: true, min: 1 })
  quantity: number;

  @Field(() => Float)
  @Prop({ required: true })
  price: number;

  @Field({ nullable: true })
  @Prop()
  variantName?: string;

  @Field({ nullable: true })
  @Prop()
  variantId?: string;

  @Field({ nullable: true })
  @Prop()
  imageUrl?: string;
}

@ObjectType()
class PaymentInfo {
  @Field()
  @Prop({ required: true })
  method: string;

  @Field(() => PaymentStatus)
  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Field({ nullable: true })
  @Prop()
  transactionId?: string;
}

@ObjectType()
class ShippingInfo {
  @Field()
  @Prop({ required: true })
  address: string;

  @Field({ nullable: true })
  @Prop()
  trackingNumber?: string;

  @Field(() => Float)
  @Prop({ default: 0 })
  cost: number;
}

@ObjectType()
@Schema({ timestamps: true })
export class Order {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true, unique: true })
  orderNumber: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Field(() => [OrderItem])
  @Prop({ type: [Object], required: true })
  items: OrderItem[];

  @Field(() => Float)
  @Prop({ required: true })
  subtotal: number;

  @Field(() => Float)
  @Prop({ default: 0 })
  tax: number;

  @Field(() => Float)
  @Prop({ required: true })
  total: number;

  @Field(() => OrderStatus)
  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Field(() => PaymentInfo)
  @Prop({ type: Object, required: true })
  payment: PaymentInfo;

  @Field(() => ShippingInfo)
  @Prop({ type: Object, required: true })
  shipping: ShippingInfo;

  @Field(() => ID, { nullable: true })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Address' })
  addressId?: string;

  @Field(() => GraphQLISODateTime)
  @Prop({ default: Date.now })
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  @Prop({ default: Date.now })
  updatedAt: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Prop()
  deliveredAt?: Date;
}

export type OrderDocument = Order & Document;
export const OrderSchema = SchemaFactory.createForClass(Order);
