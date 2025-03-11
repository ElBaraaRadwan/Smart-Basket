import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
@Schema()
export class Address {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  street: string;

  @Field()
  @Prop({ required: true })
  city: string;

  @Field()
  @Prop({ required: true })
  state: string;

  @Field()
  @Prop({ required: true })
  zipCode: string;

  @Field({ nullable: true })
  @Prop()
  apartment?: string;

  @Field()
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Field()
  @Prop({ default: false })
  isDefault: boolean;

  @Field(() => String, { nullable: true })
  @Prop()
  label?: string;

  @Field(() => [Number])
  @Prop({ type: [Number], default: [0, 0] })
  coordinates: number[];
}

export type AddressDocument = Address & Document;
export const AddressSchema = SchemaFactory.createForClass(Address);
