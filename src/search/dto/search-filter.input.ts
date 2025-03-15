import { Field, InputType, Float, ID } from '@nestjs/graphql';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

@InputType()
export class SearchFilterInput {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  rating?: number;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isAvailable?: boolean;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  tags?: string[];
}
