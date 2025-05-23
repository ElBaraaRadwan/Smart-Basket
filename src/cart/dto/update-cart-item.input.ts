import { InputType, Field, ID } from '@nestjs/graphql';
import { IsMongoId, ValidateNested, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CartItemInput } from './cart-item.input';

@InputType()
export class UpdateCartInput {
  @Field(() => [CartItemInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemInput)
  items?: CartItemInput[];
}
