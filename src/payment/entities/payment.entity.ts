import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Field, ObjectType, ID, Float } from '@nestjs/graphql';
import { PaymentStatus } from '../../common/enums';

@ObjectType()
@Schema({ timestamps: true })
export class Payment {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Order', required: true })
  orderId: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Field()
  @Prop({ required: true })
  method: string;

  @Field(() => Float)
  @Prop({ required: true })
  amount: number;

  @Field()
  @Prop({ enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Field({ nullable: true })
  @Prop()
  transactionId?: string;

  @Field({ nullable: true })
  @Prop()
  paymentIntentId?: string;

  @Field({ nullable: true })
  @Prop()
  receiptUrl?: string;

  @Field(() => Date)
  @Prop()
  createdAt: Date;

  @Field(() => Date)
  @Prop()
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  @Prop()
  paidAt?: Date;

  @Field({ nullable: true })
  @Prop()
  failureMessage?: string;
}

export type PaymentDocument = Payment & Document;
export const PaymentSchema = SchemaFactory.createForClass(Payment);
