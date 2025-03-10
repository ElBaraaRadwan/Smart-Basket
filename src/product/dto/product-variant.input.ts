import { InputType, Field, Float, Int, ID } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional, IsArray, Min, IsPositive, IsMongoId } from 'class-validator';

@InputType()
export class ProductVariantInput {
  @Field(() => ID, { nullable: true })
  @IsMongoId()
  @IsOptional()
  _id?: string;

  @Field()
  @IsString()
  name: string;

  @Field(() => Float)
  @IsNumber()
  @IsPositive()
  price: number;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  salePrice?: number;

  @Field(() => Int)
  @IsNumber()
  @Min(0)
  stock: number;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageUrls?: string[];
}
