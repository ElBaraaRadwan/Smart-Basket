import { Field, InputType, Float } from '@nestjs/graphql';
import { IsNumber, Min, Max } from 'class-validator';

@InputType()
export class LocationInput {
  @Field(() => Float)
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @Field(() => Float)
  @IsNumber()
  @Min(-180)
  @Max(180)
  lon: number;

  @Field(() => Float, { defaultValue: 10 })
  @IsNumber()
  @Min(0)
  distance: number;
}
