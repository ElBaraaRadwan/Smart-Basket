import { Field, ObjectType, Int } from '@nestjs/graphql';
import { SearchItemOutput } from './search-item.output';

@ObjectType()
export class SearchResultOutput {
  @Field(() => [SearchItemOutput])
  items: SearchItemOutput[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  pages: number;
}
