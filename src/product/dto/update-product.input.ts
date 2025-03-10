import { InputType, Field, Float, Int, ID, PartialType } from '@nestjs/graphql';
import { IsMongoId, IsOptional } from 'class-validator';
import { CreateProductInput } from './create-product.input';

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {
  @Field(() => ID)
  @IsMongoId()
  _id: string;
}
