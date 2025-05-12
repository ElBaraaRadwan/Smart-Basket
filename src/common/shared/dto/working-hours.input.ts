import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

@InputType('WorkingHoursInput') // Explicitly name the GraphQL type
export class WorkingHoursInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  day: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  open: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  close: string;
}
