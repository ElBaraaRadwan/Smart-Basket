import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

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

  @Field(() => String, { nullable: true })
  @Prop()
  variantName?: string;

  @Field(() => String, { nullable: true })
  @Prop()
  variantId?: string;

  @Field(() => String, { nullable: true })
  @Prop()
  imageUrl?: string;
}

@ObjectType()
class PaymentInfo {
  @Field()
  @Prop({ required: true })
  method: string;

  @Field()
  @Prop({ enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING })
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

  @Field(() => String)
  @Prop({ required: true, unique: true })
  orderNumber: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Field(() => [OrderItem])
  @Prop({
    type: [{
      productId: { type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true },
      productName: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true },
      variantName: { type: String },
      variantId: { type: String },
      imageUrl: { type: String }
    }]
  })
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

  @Field(() => String)
  @Prop({ enum: Object.values(OrderStatus), default: OrderStatus.PENDING })
  status: OrderStatus;

  @Field(() => PaymentInfo)
  @Prop({
    type: {
      method: { type: String, required: true },
      status: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING },
      transactionId: { type: String }
    }
  })
  payment: PaymentInfo;

  @Field(() => ShippingInfo)
  @Prop({
    type: {
      address: { type: String, required: true },
      trackingNumber: { type: String },
      cost: { type: Number, default: 0 }
    }
  })
  shipping: ShippingInfo;

  @Field(() => Date)
  @Prop()
  createdAt: Date;

  @Field(() => Date)
  @Prop()
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  @Prop()
  deliveredAt?: Date;
}

export type OrderDocument = Order & Document;
export const OrderSchema = SchemaFactory.createForClass(Order);
