// src/category/entities/category.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
@Schema({ timestamps: true })
export class Category {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true, unique: true })
  name: string;

  @Field({ nullable: true })
  @Prop()
  description?: string;

  @Field({ nullable: true })
  @Prop()
  imageUrl?: string;

  @Field(() => ID, { nullable: true })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', default: null })
  parentId?: string;

  @Field(() => Boolean)
  @Prop({ default: true })
  isActive: boolean;

  @Field(() => Number)
  @Prop({ default: 0 })
  sortOrder: number;

  @Field(() => Date)
  @Prop()
  createdAt: Date;

  @Field(() => Date)
  @Prop()
  updatedAt: Date;
}

export type CategoryDocument = Category & Document;
export const CategorySchema = SchemaFactory.createForClass(Category);
