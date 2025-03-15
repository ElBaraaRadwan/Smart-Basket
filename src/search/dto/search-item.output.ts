import { Field, ObjectType, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class SearchItem {
  @Field(() => ID)
  id: string;

  @Field()
  type: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Float, { nullable: true })
  price?: number;

  @Field(() => Float, { nullable: true })
  rating?: number;

  @Field(() => Float, { nullable: true })
  score?: number;

  @Field(() => JSON, { nullable: true })
  highlight?: Record<string, string[]>;

  @Field(() => JSON, { nullable: true })
  data?: any;
}
