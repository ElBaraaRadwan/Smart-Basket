import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SearchFilterInput {
  @Field(() => String, { nullable: true })
  category?: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Field(() => Int, { nullable: true })
  minPrice?: number;

  @Field(() => Int, { nullable: true })
  maxPrice?: number;

  @Field(() => Boolean, { nullable: true })
  inStock?: boolean;

  @Field(() => String, { nullable: true })
  sortBy?: string;

  @Field(() => String, { nullable: true, defaultValue: 'asc' })
  sortOrder?: 'asc' | 'desc';
}
