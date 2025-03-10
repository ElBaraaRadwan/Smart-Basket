import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsMongoId, IsInt, Min, IsOptional } from 'class-validator';

@InputType()
export class AddCartItemInput {
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
}
