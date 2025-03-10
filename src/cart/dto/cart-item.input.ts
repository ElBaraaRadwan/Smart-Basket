import { InputType, Field, ID, Int, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsMongoId, IsInt, Min, IsNumber, IsOptional } from 'class-validator';

@InputType()
export class CartItemInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsMongoId()
  productId: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  quantity: number;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  variantId?: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  price: number;
}
