import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsMongoId, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CartItemInput } from './cart-item.input';

@InputType()
export class CreateCartInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @Field(() => [CartItemInput], { nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemInput)
  items?: CartItemInput[];
}
