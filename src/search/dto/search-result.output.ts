import { Field, ObjectType, Int } from '@nestjs/graphql';
import { SearchItem } from './search-item.output';

@ObjectType()
export class SearchResult {
  @Field(() => [SearchItem])
  items: SearchItem[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => JSON, { nullable: true })
  aggregations?: any;
}
