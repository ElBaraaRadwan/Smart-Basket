import { Field, InputType, Int } from '@nestjs/graphql';
import { SearchFilterInput } from './search-filter.input';
import { SearchLocationInput } from './search.location.input';

@InputType()
export class SearchInput {
  @Field()
  query: string;

  @Field(() => SearchLocationInput, { nullable: true })
  location?: SearchLocationInput;

  @Field(() => Int, { defaultValue: 1 })
  page: number;

  @Field(() => Int, { defaultValue: 10 })
  limit: number;

  @Field(() => SearchFilterInput, { nullable: true })
  filters?: SearchFilterInput;
}
