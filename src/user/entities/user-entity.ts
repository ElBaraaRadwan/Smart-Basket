import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Field, ObjectType, ID } from '@nestjs/graphql';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  STORE_MANAGER = 'store_manager',
  DELIVERY_PERSON = 'delivery_person',
}

@ObjectType()
@Schema({ timestamps: true })
export class User {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  firstName: string;

  @Field()
  @Prop({ required: true })
  lastName: string;

  @Field()
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Field()
  @Prop({ default: '' })
  phoneNumber: string;

  @Field(() => [String])
  @Prop({
    type: [String],
    enum: Object.values(UserRole),
    default: [UserRole.USER],
  })
  roles: UserRole[];

  @Field(() => Date)
  @Prop()
  createdAt: Date;

  @Field(() => Date)
  @Prop()
  updatedAt: Date;

  @Field(() => Boolean)
  @Prop({ default: false })
  isEmailVerified: boolean;

  @Field({ nullable: true })
  @Prop()
  avatarUrl?: string;

  @Field(() => [String], { nullable: true })
  @Prop({ type: [String], default: [] })
  favoriteCategories?: string[];
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
