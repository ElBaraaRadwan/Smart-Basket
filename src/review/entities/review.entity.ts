import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Field, ObjectType, ID, Int } from '@nestjs/graphql';

@ObjectType()
@Schema({ timestamps: true })
export class Review {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
  productId: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Field(() => Int)
  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Field()
  @Prop({ required: true })
  title: string;

  @Field()
  @Prop({ required: true })
  comment: string;

  @Field(() => [String], { nullable: true })
  @Prop({ type: [String] })
  imageUrls?: string[];

  @Field(() => Date)
  @Prop()
  createdAt: Date;

  @Field(() => Boolean)
  @Prop({ default: true })
  isVisible: boolean;

  @Field(() => ID, { nullable: true })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Order' })
  orderId?: string;
}

export type ReviewDocument = Review & Document;
export const ReviewSchema = SchemaFactory.createForClass(Review);
