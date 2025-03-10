// src/cart/entities/cart.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Field, ObjectType, ID, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class CartItem {
  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
  productId: string;

  @Field(() => Int)
  @Prop({ required: true, min: 1 })
  quantity: number;

  @Field(() => ID, { nullable: true })
  @Prop({ type: String })
  variantId?: string;

  @Field(() => Float)
  @Prop({ required: true })
  price: number;
}

@ObjectType()
@Schema({ timestamps: true })
export class Cart {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Field(() => [CartItem])
  @Prop({ type: [{
    productId: { type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    variantId: { type: String },
    price: { type: Number, required: true }
  }] })
  items: CartItem[];

  @Field(() => Date)
  @Prop()
  updatedAt: Date;

  @Field(() => Date)
  @Prop()
  createdAt: Date;
}

export type CartDocument = Cart & Document;
export const CartSchema = SchemaFactory.createForClass(Cart);
