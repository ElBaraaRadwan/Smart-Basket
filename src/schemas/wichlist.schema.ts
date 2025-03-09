import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
@Schema({ timestamps: true })
export class Wishlist {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Field(() => [ID])
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Product' }] })
  productIds: string[];

  @Field(() => Date)
  @Prop()
  updatedAt: Date;
}

export type WishlistDocument = Wishlist & Document;
export const WishlistSchema = SchemaFactory.createForClass(Wishlist);
