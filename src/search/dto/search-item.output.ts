import { Field, ObjectType, ID, Float } from '@nestjs/graphql';
import { SearchLocationInput } from './search.location.input';

@ObjectType()
export class SearchItemOutput {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  imageUrl?: string;

  @Field(() => Float, { nullable: true })
  price?: number;

  @Field(() => String, { nullable: true })
  type?: string;

  @Field(() => String, { nullable: true })
  category?: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Field(() => Float, { nullable: true })
  score?: number;

  @Field(() => SearchLocationInput, { nullable: true })
  location?: SearchLocationInput;
}
