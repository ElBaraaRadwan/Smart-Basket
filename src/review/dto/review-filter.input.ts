import { Field, InputType, ID, Int } from '@nestjs/graphql';
import { IsMongoId, IsOptional, IsNumber, Min, Max } from 'class-validator';

@InputType()
export class ReviewFilterInput {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  productId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  minRating?: number;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  orderId?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isVisible?: boolean;
}
