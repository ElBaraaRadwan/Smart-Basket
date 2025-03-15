import { Field, InputType, Float } from '@nestjs/graphql';

@InputType()
export class SearchLocationInput {
  @Field(() => Float)
  latitude: number;

  @Field(() => Float)
  longitude: number;

  @Field(() => Float, { nullable: true })
  radius?: number;
}
