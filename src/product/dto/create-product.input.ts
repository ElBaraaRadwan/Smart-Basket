import { InputType, Field, Float, Int } from '@nestjs/graphql';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
  Min,
  IsNotEmpty,
  IsPositive,
  ArrayMinSize,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductAttributeInput } from './product-attribute.input';
import { ProductVariantInput } from './product-variant.input';

@InputType()
export class CreateProductInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(() => Float)
  @IsNumber()
  @IsPositive()
  price: number;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  salePrice?: number;

  @Field(() => [String])
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  categoryIds: string[];

  @Field(() => [String], { defaultValue: [] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageUrls?: string[];

  @Field(() => Int)
  @IsNumber()
  @Min(0)
  stock: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  sku: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  brand?: string;

  @Field(() => Boolean, { defaultValue: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Field(() => [ProductAttributeInput], { nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductAttributeInput)
  @IsOptional()
  attributes?: ProductAttributeInput[];

  @Field(() => [ProductVariantInput], { nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantInput)
  @IsOptional()
  variants?: ProductVariantInput[];

  @Field(() => Boolean, { defaultValue: false })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  weight: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  unit?: string;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  taxRate?: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @Min(1)
  @IsOptional()
  minOrderQuantity?: number;
}
