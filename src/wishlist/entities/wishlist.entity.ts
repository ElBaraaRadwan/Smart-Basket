import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Wishlist {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
