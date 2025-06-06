import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class PaginationInput {
  @Field(() => Int, { defaultValue: 1 })
  page: number;

  @Field(() => Int, { defaultValue: 10 })
  limit: number;

  @Field(() => String, { nullable: true, defaultValue: 'createdAt' })
  sortBy?: string;

  @Field(() => String, { nullable: true, defaultValue: 'desc' })
  sortOrder?: 'asc' | 'desc';
}
