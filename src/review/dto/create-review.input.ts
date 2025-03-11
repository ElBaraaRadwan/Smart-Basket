import { Field, InputType, Int, ID } from '@nestjs/graphql';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

@InputType()
export class CreateReviewInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsMongoId()
  productId: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  comment: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  imageUrls?: string[];

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  orderId?: string;
}
