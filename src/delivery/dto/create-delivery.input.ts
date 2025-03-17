import { Field, InputType, ID, Float } from '@nestjs/graphql';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class DeliveryLocationInput {
  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  address: string;
}

@InputType()
export class CreateDeliveryInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsMongoId()
  orderId: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  driverId?: string;

  @Field(() => DeliveryLocationInput)
  @ValidateNested()
  @Type(() => DeliveryLocationInput)
  pickupLocation: DeliveryLocationInput;

  @Field(() => DeliveryLocationInput)
  @ValidateNested()
  @Type(() => DeliveryLocationInput)
  dropoffLocation: DeliveryLocationInput;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  estimatedDeliveryTime?: number;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  storeId?: string;
}
