import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Field, ObjectType, ID, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class ProductAttribute {
  @Field()
  name: string;

  @Field()
  value: string;
}

@ObjectType()
export class ProductVariant {
  @Field(() => ID)
  _id: string;

  @Field()
  name: string;

  @Field(() => Float)
  price: number;

  @Field(() => Float, { nullable: true })
  salePrice?: number;

  @Field(() => Int)
  stock: number;

  @Field(() => [String], { nullable: true })
  imageUrls?: string[];
}

const ProductVariantSchema = new MongooseSchema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  salePrice: { type: Number },
  stock: { type: Number, required: true, default: 0 },
  imageUrls: { type: [String], default: [] }
}, { _id: true });

@ObjectType()
@Schema({ timestamps: true })
export class Product {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true })
  description: string;

  @Field(() => Float)
  @Prop({ required: true })
  price: number;

  @Field(() => Float, { nullable: true })
  @Prop()
  salePrice?: number;

  @Field(() => [String])
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Category' }] })
  categoryIds: string[];

  @Field(() => [String])
  @Prop({ type: [String], default: [] })
  imageUrls: string[];

  @Field(() => Float)
  @Prop({ default: 0 })
  averageRating: number;

  @Field(() => Int)
  @Prop({ default: 0 })
  reviewCount: number;

  @Field(() => Int)
  @Prop({ required: true, default: 0 })
  stock: number;

  @Field(() => String)
  @Prop({ required: true })
  sku: string;

  @Field(() => String, { nullable: true })
  @Prop()
  brand?: string;

  @Field(() => Boolean)
  @Prop({ default: true })
  isActive: boolean;

  @Field(() => [ProductAttribute], { nullable: true })
  @Prop({ type: [{ name: String, value: String }], default: [] })
  attributes?: ProductAttribute[];

  @Field(() => [ProductVariant], { nullable: true })
  @Prop({ type: [ProductVariantSchema], default: [] })
  variants?: ProductVariant[];

  @Field(() => Boolean)
  @Prop({ default: false })
  isFeatured: boolean;

  @Field(() => Float)
  @Prop({ required: true, default: 0 })
  weight: number;

  @Field(() => String, { nullable: true })
  @Prop()
  unit?: string;

  @Field(() => Date)
  @Prop()
  createdAt: Date;

  @Field(() => Date)
  @Prop()
  updatedAt: Date;

  @Field(() => Float, { nullable: true })
  @Prop()
  taxRate?: number;

  @Field(() => Int, { nullable: true })
  @Prop()
  minOrderQuantity?: number;
}

export type ProductDocument = Product & Document;
export const ProductSchema = SchemaFactory.createForClass(Product);
