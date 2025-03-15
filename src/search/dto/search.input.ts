import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, IsString, IsNumber, Min, IsEnum } from 'class-validator';
import { LocationInput } from './search.location.input';
import { SearchFilterInput } from './search-filter.input';

export enum SearchSortField {
  RELEVANCE = 'relevance',
  PRICE = 'price',
  RATING = 'rating',
  CREATED_AT = 'createdAt',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

@InputType()
export class SearchInput {
  @Field()
  @IsString()
  query: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  type?: string;

  @Field(() => SearchFilterInput, { nullable: true })
  @IsOptional()
  filters?: SearchFilterInput;

  @Field(() => Int, { defaultValue: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @Field(() => Int, { defaultValue: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(SearchSortField)
  sortBy?: string;

  @Field(() => String, { nullable: true, defaultValue: SortOrder.DESC })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: string;

  @Field(() => LocationInput, { nullable: true })
  @IsOptional()
  location?: LocationInput;
}
