import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsArray, ArrayMinSize, IsOptional } from 'class-validator';

@InputType('DeliveryZoneInput')
export class DeliveryZoneInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  areaName: string;

  @Field(() => [String])
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  zipCodes: string[];
}
