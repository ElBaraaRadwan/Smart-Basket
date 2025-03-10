import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsMongoId, IsOptional, Min } from 'class-validator';

@InputType()
export class CartItemInput {
  @Field(() => ID)
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
}
