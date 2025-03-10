import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class CartTotalOutput {
  @Field(() => Float)
  total: number;
}
